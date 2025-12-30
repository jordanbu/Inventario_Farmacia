// backend/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuración de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyCMMe8e30w5mweyC6fu2FZGVVFyuakU2gQ';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Función para buscar productos por nombre o efecto
async function searchProductRecommendations(query, allProducts) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Preparar información de productos disponibles
        const productsInfo = allProducts.map(p => 
            `- ${p.nombre} (${p.tipoDeProducto}) - Marca: ${p.marcaLaboratorio}, Stock: ${p.stock}`
        ).join('\n');

        const prompt = `Eres un asistente farmacéutico experto. Un cliente está buscando: "${query}"

Productos disponibles en inventario:
${productsInfo}

Por favor:
1. Identifica si algún producto del inventario coincide con la búsqueda
2. Si no hay coincidencia exacta, sugiere productos alternativos con efectos similares
3. Si no hay productos similares en inventario, recomienda qué tipo de medicamentos buscar y menciona que no están disponibles actualmente
4. Proporciona información útil sobre el uso y efectos

Formato de respuesta:
- Sé breve y claro
- Lista los productos encontrados o similares
- Menciona advertencias importantes si aplican
- Si no hay productos, explica qué alternativas existen`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            recommendation: text,
            query: query
        };
    } catch (error) {
        console.error('Error en Gemini API:', error);
        return {
            success: false,
            error: 'Error al procesar la consulta',
            recommendation: 'No se pudo generar una recomendación en este momento.'
        };
    }
}

// Función para obtener información sobre síntomas
async function getSymptomAdvice(symptom, allProducts) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const productsInfo = allProducts.map(p => 
            `- ${p.nombre} (${p.tipoDeProducto}) - Marca: ${p.marcaLaboratorio}`
        ).join('\n');

        const prompt = `Eres un asistente farmacéutico. Un cliente describe el siguiente síntoma o condición: "${symptom}"

Productos disponibles en la farmacia:
${productsInfo}

Por favor:
1. Sugiere qué productos del inventario podrían ayudar
2. Si no hay productos adecuados, explica qué tipo de medicamento sería apropiado
3. Proporciona consejos generales (recuerda que no reemplazas consulta médica)
4. Menciona cuándo es importante consultar a un médico

IMPORTANTE: Sé responsable con las recomendaciones médicas. Siempre sugiere consultar a un profesional para casos serios.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            success: true,
            advice: text,
            symptom: symptom
        };
    } catch (error) {
        console.error('Error en Gemini API:', error);
        return {
            success: false,
            error: 'Error al procesar la consulta',
            advice: 'No se pudo generar un consejo en este momento.'
        };
    }
}

module.exports = {
    searchProductRecommendations,
    getSymptomAdvice
};
