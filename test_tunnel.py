#!/usr/bin/env python3
"""Test SSH connection through socat tunnel."""
import subprocess
import socket
import time
import sys

SERVER_IP = "8.217.55.150"
SSH_PORT = 22
PROXY_HOST = "127.0.0.1"
PROXY_PORT = 18080
LOCAL_PORT = 2222

# 1. Start socat tunnel
print("Starting socat tunnel...")
proc = subprocess.Popen(
    ['socat', f'TCP-LISTEN:{LOCAL_PORT},reuseaddr,fork',
     f'PROXY:{PROXY_HOST}:{SERVER_IP}:{SSH_PORT},proxyport={PROXY_PORT}'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)
time.sleep(2)

# Check if socat is running
if proc.poll() is not None:
    out, err = proc.communicate()
    print(f"socat failed to start: {err.decode()}")
    sys.exit(1)

print(f"socat started (PID: {proc.pid})")

# 2. Test connection through tunnel
try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(60)
    sock.connect(('127.0.0.1', LOCAL_PORT))
    print("Connected to local tunnel port")

    # Read SSH banner
    data = b""
    try:
        while b"\n" not in data:
            chunk = sock.recv(128)
            if not chunk:
                break
            data += chunk
        print(f"Server banner: {data.strip().decode()}")
    except socket.timeout:
        print(f"Banner timeout, partial: {data}")
        sock.close()
        sys.exit(1)

    # Send client banner
    sock.sendall(b"SSH-2.0-OpenSSH_9.6p1\r\n")
    print("Sent client banner")

    # Wait for KEXINIT
    sock.settimeout(30)
    try:
        kex_data = b""
        while True:
            chunk = sock.recv(4096)
            if not chunk:
                print(f"Connection closed after {len(kex_data)} bytes of KEXINIT data")
                break
            kex_data += chunk
            print(f"  Received {len(chunk)} bytes (total KEXINIT: {len(kex_data)})")
            if len(kex_data) > 100:
                print("  KEXINIT data received! Tunnel is working.")
                break
    except socket.timeout:
        print(f"KEXINIT timeout after {len(kex_data)} bytes")

    sock.close()
except Exception as e:
    print(f"Error: {e}")
finally:
    proc.terminate()
    proc.wait()
    print("socat stopped")
