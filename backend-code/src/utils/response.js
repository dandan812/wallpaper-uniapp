function createPayload(errCode, errMsg, data = null, total = null) {
  const payload = {
    errCode,
    errMsg,
    data,
    timeCost: 0
  };

  if (total !== null) {
    payload.total = total;
  }

  return payload;
}

function isResponseObject(target) {
  // 兼容两种调用方式：
  // 1. success(res, data, msg)
  // 2. const result = success(data, msg, total)
  return target && typeof target.status === 'function' && typeof target.json === 'function';
}

exports.success = (resOrData = {}, dataOrMsg = '查询成功', msgOrTotal = null, totalMaybe = null) => {
  if (isResponseObject(resOrData)) {
    const payload = createPayload(
      0,
      typeof msgOrTotal === 'string' ? msgOrTotal : '查询成功',
      dataOrMsg,
      typeof totalMaybe === 'number' ? totalMaybe : null
    );
    return resOrData.status(200).json(payload);
  }

  return createPayload(
    0,
    typeof dataOrMsg === 'string' ? dataOrMsg : '查询成功',
    resOrData,
    typeof msgOrTotal === 'number' ? msgOrTotal : null
  );
};

exports.error = (resOrMsg = '请求失败', msgOrCode = 400, codeMaybe = null) => {
  // error 也支持“直接返回对象”和“直接写入 res”两种模式，
  // 这样可以兼容历史 controller，逐步迁移而不是一次性重写。
  if (isResponseObject(resOrMsg)) {
    const statusCode = typeof codeMaybe === 'number' ? codeMaybe : 400;
    return resOrMsg.status(statusCode).json(
      createPayload(statusCode, typeof msgOrCode === 'string' ? msgOrCode : '请求失败')
    );
  }

  return createPayload(
    typeof msgOrCode === 'number' ? msgOrCode : 400,
    typeof resOrMsg === 'string' ? resOrMsg : '请求失败'
  );
};
