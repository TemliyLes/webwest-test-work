interface Tender {
    id: number,
    title: string,
    description: string,
}

interface Data {
    data: Tender[],
    page_count: number,
    page_number: number,
    page_size: number,
    total: number,
}
interface Details {
    title: string,
    description: string,
}

export type { Tender, Data, Details }