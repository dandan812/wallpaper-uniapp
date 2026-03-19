const startTime = Date.now();

exports.success = (data = {}, msg = '查询成功', total = null) => {
  const response = {
    errCode: 0,
    errMsg: msg,
    data,
    timeCost: Date.now() - startTime
  };
  if (total !== null) response.total = total;
  return response;
};

exports.error = (msg = '请求失败', code = 400) => {
  return {
    errCode: code,
    errMsg: msg,
    timeCost: Date.now() - startTime
  };
};
