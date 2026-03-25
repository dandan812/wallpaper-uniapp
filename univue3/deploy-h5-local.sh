#!/bin/bash

echo "=========================================="
echo "  前端 H5 本地打包上传脚本"
echo "=========================================="
echo ""

if [ ! -f "manifest.json" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

SERVER_IP="8.135.46.112"
SERVER_USER="root"
SERVER_PATH="/var/www/wallpaper-h5"
H5_PATH="unpackage/dist/build/web"

echo "服务器: ${SERVER_IP}"
echo "部署路径: ${SERVER_PATH}"
echo ""

if [ ! -d "$H5_PATH" ]; then
    echo "错误: 未找到构建产物 $H5_PATH"
    echo ""
    echo "请先在 HBuilderX 中执行:"
    echo "  发行 -> 网站-H5移动版"
    echo ""
    exit 1
fi

echo "已找到构建产物: $H5_PATH"
echo "本次部署会先清空服务器前端目录，再上传新文件。"
echo ""

read -p "确认继续部署到 ${SERVER_IP} ? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "已取消上传"
    exit 0
fi

echo ""
echo "1/2 清空服务器旧前端文件..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${SERVER_PATH} && find ${SERVER_PATH} -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

if [ $? -ne 0 ]; then
    echo ""
    echo "错误: 清空服务器目录失败"
    exit 1
fi

echo ""
echo "2/2 上传新构建产物..."
scp -r ${H5_PATH}/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

if [ $? -eq 0 ]; then
    echo ""
    echo "修正服务器目录权限..."
    ssh ${SERVER_USER}@${SERVER_IP} "chown -R www-data:www-data ${SERVER_PATH} && find ${SERVER_PATH} -type d -exec chmod 755 {} + && find ${SERVER_PATH} -type f -exec chmod 644 {} +"

    if [ $? -ne 0 ]; then
        echo ""
        echo "警告: 文件已上传，但权限修正失败，请手动检查服务器权限"
        exit 1
    fi

    echo ""
    echo "=========================================="
    echo "部署完成"
    echo "=========================================="
    echo ""
    echo "访问地址: http://${SERVER_IP}"
    echo "如果浏览器没变化，请强制刷新: Ctrl + F5"
    echo ""
else
    echo ""
    echo "错误: 上传失败，请检查 SSH 连接和服务器权限"
    echo ""
fi
