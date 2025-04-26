export type DuitkuResponse = {
    merchantCode: string,
    reference: string,
    paymentUrl: string,
    qrString?: string,
    amount: string,
    statusCode: string,
    statusMessage: string
}