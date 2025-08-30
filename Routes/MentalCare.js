const express = require('express');
const router = express.Router();

// Middleware para verificar se o usuário está logado
function requireAuth(req, res, next) {
    // Em desenvolvimento, simular usuário logado
    if (process.env.NODE_ENV === 'development') {
        req.session.userId = 'dev_user';
        req.session.username = 'Usuário de Teste';
    }
    
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
}

// Rota para a página de exercícios de saúde mental
router.get('/exercicios', requireAuth, (req, res) => {
    try {
        res.render('MentalHealthCare/exercicios', {
            currentPage: 'meditations',
            username: req.session.username || 'Usuário'
        });
    } catch (error) {
        console.error('Erro ao carregar página de exercícios:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota para a página de cuidados (mantendo compatibilidade)
router.get('/cuidados', requireAuth, (req, res) => {
    try {
        res.redirect('/exercicios');
    } catch (error) {
        console.error('Erro ao redirecionar para exercícios:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// API para salvar progresso de exercícios (opcional - para futuras implementações)
router.post('/api/exercicios/progresso', requireAuth, (req, res) => {
    try {
        const { tipo, exercicio, duracao, completado } = req.body;
        const userId = req.session.userId;
        
        // Aqui você pode implementar a lógica para salvar no banco de dados
        // Por exemplo, salvar em uma coleção de progressos
        
        res.json({
            success: true,
            message: 'Progresso salvo com sucesso'
        });
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar progresso'
        });
    }
});

// API para obter histórico de exercícios (opcional - para futuras implementações)
router.get('/api/exercicios/historico', requireAuth, (req, res) => {
    try {
        const userId = req.session.userId;
        
        // Aqui você pode implementar a lógica para buscar do banco de dados
        // Por enquanto, retorna um array vazio
        
        res.json({
            success: true,
            historico: []
        });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar histórico'
        });
    }
});

module.exports = router;

