import { ref, toRefs } from 'vue'
import { Dictionary } from 'api'

export function useDict (...args) {
  const res = ref({})
  args.forEach(type => {
    res.value[type] = []
    Dictionary.dictTypeListDetail(type).then(response => {
      res.value[type] = response.data.map(i => ({label: i.dictLabel, value: i.dictValue}))
    })
  })
  return toRefs(res.value)
}