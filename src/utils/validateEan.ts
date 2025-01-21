export const validateEAN = async (ean: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/validate/ean/${ean}`);
    
    if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }
};