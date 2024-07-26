const ls = window.localStorage

const saveToLocal = (key: string, value: unknown) => {
    ls.setItem(key, JSON.stringify(value))
}

const getFromLocal = (key: string) => {
    const val = ls.getItem(key)
    if (val) {
        try {
            return JSON.parse(val)
        } catch (error) {
            return val
        }
    }
    return undefined
}

const removeFromLocal = (key: string) => {
    ls.removeItem(key)
}

const clearLocal = () => {
    ls.clear()
}

export { saveToLocal, getFromLocal, removeFromLocal, clearLocal }
