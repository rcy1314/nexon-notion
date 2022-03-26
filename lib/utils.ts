import { CanonicalPageData, CanonicalPageDataSerialized } from "./types"

export const serializeCanonicalPageData = (data :CanonicalPageData): CanonicalPageDataSerialized => {
  return {
    ...data,
    createdTime: data.createdTime.toISOString(),
    lastEditedTime: data.lastEditedTime.toISOString(),
  }
}
