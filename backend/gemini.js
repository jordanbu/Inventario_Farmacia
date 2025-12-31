// backend/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuración de la API de Gemini
const GEMINI_API_KEY = 'AIzaSyCMMe8e30w5mweyC6fu2FZGVVFyuakU2gQ';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Función auxiliar para respuestas locales (fallback)
function getLocalRecommendation(symptom, products) {
    const lowerSymptom = symptom.toLowerCase();
    let recommendations = [];
    
    // Buscar productos relevantes
    if (lowerSymptom.includes('dolor') || lowerSymptom.includes('duele') || lowerSymptom.includes('cabeza')) {
        const painRelief = products.filter(p => 
            p.nombre.toLowerCase().includes('migral') || 
            p.nombre.toLowerCase().includes('paracetamol') ||
            p.nombre.toLowerCase().includes('ibuprofeno')
        );
        if (painRelief.length > 0) {
            recommendations = painRelief.map(p => `• ${p.nombre} (${p.tipoDeProducto}) - Bs ${p.precio}, Stock: ${p.stock}`);
        }
    }
    
    if (lowerSymptom.includes('tos') || lowerSymptom.includes('gripe') || lowerSymptom.includes('resfriado')) {
        const coughMeds = products.filter(p => 
            p.tipoDeProducto.toLowerCase().includes('jarabe') ||
            p.nombre.toLowerCase().includes('tos') ||
            p.nombre.toLowerCase().includes('gripe')
        );
        if (coughMeds.length > 0) {
            recommendations = coughMeds.map(p => `• ${p.nombre} (${p.tipoDeProducto}) - Bs ${p.precio}, Stock: ${p.stock}`);
        }
    }
    
    if (recommendations.length > 0) {
        return `Para "${symptom}", te recomiendo:\n\n${recommendations.join('\n')}\n\nSi los síntomas persisten, consulta a un médico.`;
    } else {
        return `Actualmente no tenemos productos específicos para "${symptom}" en stock. Te recomiendo consultar a un farmacéutico o médico para una recomendación personalizada.`;
    }
}

// Función para buscar productos por nombre o efecto
async function searchProductRecommendations(query, allProducts) {
    try {
        // Búsqueda local en el inventario
        const lowerQuery = query.toLowerCase();
        const matchingProducts = allProducts.filter(p => 
            p.nombre.toLowerCase().includes(lowerQuery) ||
            p.tipoDeProducto.toLowerCase().includes(lowerQuery) ||
            p.marcaLaboratorio.toLowerCase().includes(lowerQuery)
        );

        if (matchingProducts.length > 0) {
            const productList = matchingProducts.map(p => 
                `• ${p.nombre} - ${p.tipoDeProducto}\n  Marca: ${p.marcaLaboratorio}\n  Precio: Bs ${p.precio}\n  Stock: ${p.stock} unidades`
            ).join('\n\n');
            
            return {
                success: true,
                recommendation: `Encontré estos productos:\n\n${productList}`,
                query: query
            };
        } else {
            return {
                success: true,
                recommendation: `No encontré "${query}" en el inventario.\n\nProductos disponibles:\n${allProducts.slice(0, 5).map(p => `• ${p.nombre} (${p.tipoDeProducto})`).join('\n')}`,
                query: query
            };
        }
    } catch (error) {
        console.error('Error en búsqueda:', error);
        return {
            success: false,
            error: 'Error al procesar la búsqueda',
            recommendation: 'No se pudo realizar la búsqueda.'
        };
    }
}

// Función para obtener información sobre síntomas
async function getSymptomAdvice(symptom, allProducts) {
    try {
        console.log('🔍 Consultando Gemini para síntoma:', symptom);
        
        // Intentar con Gemini primero
        try {
            const model = genAI.getGenerativeModel({ 
                model: 'gemini-pro'
            });

            const productsInfo = allProducts.map(p => 
                `- ${p.nombre} (${p.tipoDeProducto}) - Marca: ${p.marcaLaboratorio}`
            ).join('\n');

            console.log('📦 Productos en inventario:', allProducts.length);

            const prompt = `Eres un asistente farmacéutico. Un cliente pregunta: "${symptom}"

INVENTARIO DISPONIBLE:
${productsInfo}

INSTRUCCIONES:
1. Da una respuesta CORTA Y DIRECTA (máximo 4-5 líneas)
2. Menciona SOLO productos que SÍ estén en el inventario
3. Si no hay productos apropiados, recomienda qué buscar en otras farmacias
4. Usa un tono amigable y profesional
5. Si es caso serio, menciona consultar a un médico

IMPORTANTE: Respuesta breve, clara y útil.`;

            console.log('📤 Enviando consulta a Gemini...');
            const result = await model.generateContent(prompt);
            console.log('📥 Respuesta recibida');
            
            const response = await result.response;
            const text = response.text();
            
            console.log('✅ Texto generado de Gemini');

            return {
                success: true,
                advice: text,
                symptom: symptom
            };
        } catch (geminiError) {
            console.log('⚠️ Gemini no disponible, usando recomendaciones locales');
            console.log('Error Gemini:', geminiError.message);
            
            // Usar sistema de recomendaciones local
            const localAdvice = getLocalRecommendation(symptom, allProducts);
            return {
                success: true,
                advice: localAdvice,
                symptom: symptom,
                source: 'local'
            };
        }
    } catch (error) {
        console.error('❌ Error general:', error.message);
        return {
            success: false,
            error: 'Error al procesar la consulta',
            advice: `Error: ${error.message}`
        };
    }
}

module.exports = {
    searchProductRecommendations,
    getSymptomAdvice
};
