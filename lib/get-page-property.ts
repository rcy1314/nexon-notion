import * as types from './types'
import { getTextContent } from 'notion-utils'

// Add feature: get date property.
export function getPagePropertyExtend(
  propertyName: string,
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): string | null {
  if (!block.properties) {
    // TODO: check parent page?
    return null
  }

  console.group('getPagePropertyExtend', propertyName, block.id)
  const collection = recordMap.collection[block.parent_id]?.value

  if (collection) {
    const propertyId = Object.keys(collection.schema).find(
      (key) => collection.schema[key]?.name === propertyName
    )

    if (propertyId) {
      const propertyValue = block.properties[propertyId]
      const ret = getTextContent(propertyValue)

      console.log('propertyValue', propertyValue, typeof propertyValue)
      console.log('ret', ret, typeof ret)

      try {
        // date property.
        const value = propertyValue[0][1][0][1]['start_date']
        if (value) {
          console.groupEnd()
          return value
        }
      } catch (e) {
      } finally {
      }

      console.groupEnd()
      return ret || propertyValue
    }
  }

  console.groupEnd()
  return null
}
