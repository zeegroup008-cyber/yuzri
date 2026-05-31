import pb from "./pb"

export async function getProducts(type) {
  return await pb.collection("products").getFullList({
    filter: `type = "${type}" && is_active = true`,
    sort: "sort_order",
    requestKey: null,
  })
}

export async function getPakets(productId) {
  return await pb.collection("pakets").getFullList({
    filter: `product_id = "${productId}" && is_active = true`,
    sort: "price",
    requestKey: null,
  })
}

export function getImageUrl(collectionId, recordId, filename) {
  if (!filename) return null
  return `https://yuzri-api.onrender.com/api/files/${collectionId}/${recordId}/${filename}`
}
