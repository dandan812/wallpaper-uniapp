import paramiko

host = "8.135.46.112"
username = "root"
password = "Hl13689511232"
commands = [
    "pkill -f \"node src/app.js\" || true",
    "pm2 delete wallpaper-api || true",
    "mkdir -p /var/www/wallpaper-api/logs",
    "cd /var/www/wallpaper-api && pm2 start ecosystem.config.js --only wallpaper-api",
    "pm2 save",
    "pm2 status",
    "ss -ltnp | grep 3000 || true",
    "curl -s \"http://127.0.0.1:3000/api/categories?limit=1&skip=0\" -H \"access-key: key123456\""
]

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, username=username, password=password)

for command in commands:
    stdin, stdout, stderr = ssh.exec_command(command, timeout=1200)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    print("$ " + command)
    if out.strip():
        print(out)
    if err.strip():
        print("[stderr]")
        print(err)
    print(f"[exit={code}]")
    if code != 0:
        raise SystemExit(code)

ssh.close()
