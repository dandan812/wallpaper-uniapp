#!/bin/bash

# 数据库备份脚本
# 每天自动备份数据库到本地和 OSS

set -e

# 读取配置
if [ -f /root/wallpaper-config.txt ]; then
    source /root/wallpaper-config.txt
else
    echo "错误: 找不到配置文件"
    exit 1
fi

# 备份目录
BACKUP_DIR="/root/backups/mysql"
mkdir -p ${BACKUP_DIR}

# 备份文件名（带时间戳）
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"

echo "开始备份数据库: ${DB_NAME}"
echo "备份文件: ${BACKUP_FILE}"

# 执行备份
mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "备份成功！"
    
    # 获取文件大小
    SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo "文件大小: ${SIZE}"
    
    # 删除 7 天前的备份
    find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete
    echo "已清理 7 天前的备份文件"
    
    # TODO: 上传到 OSS（需要配置 OSS）
    # aliyun oss cp ${BACKUP_FILE} oss://your-bucket/backups/
    
else
    echo "备份失败！"
    exit 1
fi

echo "备份完成！"
