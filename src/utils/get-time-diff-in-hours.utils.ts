export default function getTimeDiffInHours(initialDate: Date, finalDate: Date): number {
    return Math.ceil(((new Date(finalDate)).getTime() - (new Date(initialDate)).getTime()) / 3600000);;
}