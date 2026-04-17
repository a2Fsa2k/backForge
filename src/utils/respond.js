function ok(res, data, status = 200) {
  // Compatibility: frontend expects specific top-level fields (e.g., token, doctor, patients, appointments)
  // but backend also wants a consistent wrapper.
  // If data is an object, spread it to top-level while also returning under data.
  const payload = { success: true, data };
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  }
  return res.status(status).json(payload);
}

function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

module.exports = { ok, fail };
