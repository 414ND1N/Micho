const convertDurationToSeconds = (duration) => {
    const parts = duration.split(':').map(Number)

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1]
    }
    return 0
}

const getUltraLowMemoryOptions = (durationStr) => {
    const seconds = convertDurationToSeconds(durationStr)
    const minutes = seconds / 60

    if (minutes > 60) { // Videos >1h
        return {
            waterMark: 1 << 24, // 1MB
            buffering: 35000,   // 10 segundos
        };
    } else if (minutes > 30) { // Videos >30min
        return {
            waterMark: 1 << 28, // 2MB
            buffering: 35000,   // 15 segundos
        };
    } else if (minutes > 10) { // Videos >5min
        return {
            waterMark: 1 << 30, // 4MB
            buffering: 35000,   // 25 segundos
        };
    }

    return {
        waterMark: 1 << 22, // 4MB para videos cortos
        buffering: 30000,   // 30 segundos
    }
}

module.exports = {
    convertDurationToSeconds,
    getUltraLowMemoryOptions
}
