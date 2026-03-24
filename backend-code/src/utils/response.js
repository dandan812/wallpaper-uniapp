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
