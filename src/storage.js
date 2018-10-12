const storage = window.localStorage;

export function deletePool(name) {
  const pools = loadPools();
  delete pools[name];
  savePools(pools);
}

export function savePool(name, pool) {
  const pools = loadPools();
  pools[name] = pool;
  savePools(pools);
}

function savePools(pools) {
  const serialized = JSON.stringify(pools);
  storage.setItem('pools', serialized);
}

export function loadPools() {
  const serialized = storage.getItem('pools');
  if (!serialized) {
    return {};
  }

  const pools = JSON.parse(serialized);

  return pools;
}
