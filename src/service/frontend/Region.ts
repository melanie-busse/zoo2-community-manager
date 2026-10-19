export async function createRegionOnClient(formData: any): Promise<any> {
  const response = await fetch("/api/regions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function updateRegionOnClient(id: number, formData: any): Promise<any> {
  const response = await fetch(`/api/regions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export async function deleteRegionOnClient(id: number): Promise<void> {
  const response = await fetch(`/api/regions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}

export async function createShopOnClient(regionId: number, data: any): Promise<any> {
  const response = await fetch(`/api/regions/${regionId}/shops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function updateShopOnClient(regionId: number, shopId: number, data: any): Promise<any> {
  const response = await fetch(`/api/regions/${regionId}/shops/${shopId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    const error: any = new Error(result.message);
    error.status = response.status;
    throw error;
  }
  return result;
}

export async function deleteShopOnClient(regionId: number, shopId: number): Promise<void> {
  const response = await fetch(`/api/regions/${regionId}/shops/${shopId}`, { method: "DELETE" });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message);
  }
}
