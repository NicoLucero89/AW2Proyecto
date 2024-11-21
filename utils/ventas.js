export const generate_id = (item, seller)=>{
    const date = new Date()
    return date.toISOString().replace(/\D/g, '')+item+seller
}
