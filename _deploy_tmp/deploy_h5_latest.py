import os
import shutil
import tarfile
import zipfile

import paramiko


BASE_DIR = r"C:\Users\hulian\Desktop\huliang\bizi\uniappvue3\_deploy_tmp"
WEB_DIR = r"C:\Users\hulian\Desktop\huliang\bizi\uniappvue3\univue3\unpackage\dist\build\web"
ZIP_PATH = os.path.join(BASE_DIR, "wallpaper-h5-latest.zip")
TAR_PATH = os.path.join(BASE_DIR, "wallpaper-h5-latest.tar.gz")
EXTRACT_DIR = os.path.join(BASE_DIR, "wallpaper-h5-extract")

HOST = "8.135.46.112"
USER = "root"
PASSWORD = "Hl13689511232"


def make_archive():
    os.makedirs(BASE_DIR, exist_ok=True)
    for path in [ZIP_PATH, TAR_PATH]:
        if os.path.exists(path):
            os.remove(path)
    if os.path.exists(EXTRACT_DIR):
        shutil.rmtree(EXTRACT_DIR)
    os.makedirs(EXTRACT_DIR, exist_ok=True)

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(WEB_DIR):
            for file_name in files:
                full_path = os.path.join(root, file_name)
                arc_name = os.path.relpath(full_path, WEB_DIR)
                zf.write(full_path, arc_name)

    with zipfile.ZipFile(ZIP_PATH, "r") as zf:
        zf.extractall(EXTRACT_DIR)

    with tarfile.open(TAR_PATH, "w:gz") as tf:
        for name in os.listdir(EXTRACT_DIR):
            tf.add(os.path.join(EXTRACT_DIR, name), arcname=name)


def deploy():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASSWORD, timeout=20)

    sftp = client.open_sftp()
    sftp.put(TAR_PATH, "/tmp/wallpaper-h5-latest.tar.gz")
    sftp.close()

    commands = [
        "mkdir -p /var/www/wallpaper-h5",
        "find /var/www/wallpaper-h5 -mindepth 1 -maxdepth 1 -exec rm -rf {} +",
        "tar -xzf /tmp/wallpaper-h5-latest.tar.gz -C /var/www/wallpaper-h5",
        "chown -R www-data:www-data /var/www/wallpaper-h5",
        "find /var/www/wallpaper-h5 -type d -exec chmod 755 {} +",
        "find /var/www/wallpaper-h5 -type f -exec chmod 644 {} +",
        "nginx -t && systemctl reload nginx",
        "ls /var/www/wallpaper-h5/assets | tail -n 8",
        "curl -s -I http://127.0.0.1 | head -n 5",
    ]

    for cmd in commands:
        print(f"===== {cmd} =====")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=120)
        print(stdout.read().decode("utf-8", "ignore"))
        err = stderr.read().decode("utf-8", "ignore")
        if err:
            print("[stderr]")
            print(err)

    client.close()


if __name__ == "__main__":
    make_archive()
    deploy()
