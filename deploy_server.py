#!/usr/bin/env python3
"""Deploy to server via SSH using pexpect to handle password."""
import pexpect
import sys
import time

SERVER_IP = "8.217.55.150"
USERNAME = "root"
PASSWORD = "Lzy20061022"
PROXY = "127.0.0.1:18080"

def ssh_run(cmd, timeout=120):
    """Run a command on the remote server via SSH."""
    ssh_cmd = (
        f"ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "
        f"-o ConnectTimeout=60 -o ConnectionAttempts=3 "
        f"-o ServerAliveInterval=15 -o ServerAliveCountMax=4 "
        f"-o PreferredAuthentications=password -o PubkeyAuthentication=no "
        f'-o ProxyCommand="nc -w 60 -X connect -x {PROXY} %h %p" '
        f"{USERNAME}@{SERVER_IP} '{cmd}'"
    )
    
    print(f"\n>>> {cmd}")
    
    child = pexpect.spawn('/bin/bash', ['-c', ssh_cmd], timeout=timeout, encoding='utf-8')
    
    try:
        idx = child.expect(['[Pp]assword:', pexpect.EOF, pexpect.TIMEOUT], timeout=timeout)
        if idx == 0:
            child.sendline(PASSWORD)
            child.expect(pexpect.EOF, timeout=timeout)
        elif idx == 1:
            pass  # EOF before password prompt
        elif idx == 2:
            print("[TIMEOUT waiting for password prompt]")
            child.close()
            return None, -1
    except Exception as e:
        print(f"[Error: {e}]")
        child.close()
        return None, -1
    
    output = child.before or ""
    child.close()
    
    # Clean output
    lines = output.split('\n')
    clean_lines = [l for l in lines if 'password' not in l.lower() and 'Warning:' not in l]
    result = '\n'.join(clean_lines).strip()
    
    print(result)
    rc = child.exitstatus if child.exitstatus is not None else -1
    print(f"[exit: {rc}]")
    return result, rc

def main():
    print(f"Connecting to {SERVER_IP} via proxy {PROXY}...")
    
    # Test connection
    result, rc = ssh_run("echo CONNECTED && uname -a && cat /etc/os-release | head -3", timeout=120)
    
    if rc != 0 or not result or "CONNECTED" not in result:
        print("\nFirst attempt failed, retrying...")
        time.sleep(5)
        result, rc = ssh_run("echo CONNECTED && uname -a", timeout=120)
        if rc != 0 or not result or "CONNECTED" not in result:
            print("\nFailed to connect! Trying one more time...")
            time.sleep(10)
            result, rc = ssh_run("echo CONNECTED", timeout=120)
            if rc != 0 or not result or "CONNECTED" not in result:
                print("\nAll SSH connection attempts failed!")
                sys.exit(1)
    
    print("\n=== Connection successful! ===\n")
    
    # Check system
    ssh_run("cat /etc/os-release | head -5", timeout=60)
    
    # Check nginx
    ssh_run("which nginx && nginx -v 2>&1 || echo 'nginx not installed'", timeout=60)
    
    # Check git
    ssh_run("which git && git --version || echo 'git not installed'", timeout=60)
    
    # Check web directory
    ssh_run("ls -la /usr/share/nginx/html/ 2>/dev/null || echo 'no nginx html dir'", timeout=60)
    
    # Check nginx status
    ssh_run("systemctl status nginx 2>&1 | head -10 || echo 'nginx not running'", timeout=60)
    
    # Check listening ports
    ssh_run("ss -tlnp | head -20 || netstat -tlnp | head -20", timeout=60)

if __name__ == "__main__":
    main()
