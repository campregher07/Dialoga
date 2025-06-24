const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const User = require('../models/User');
const mongoose = require('mongoose');

// Função para calcular dias consecutivos de uso
async function calcularDiasConsecutivos(userId) {
    try {
        // Buscar todas as entradas do usuário ordenadas por data (mais recente primeiro)
        const entradas = await Diary.find({ userId: userId })
            .sort({ date: -1 })
            .select('date');

        if (entradas.length === 0) {
            return 0;
        }

        // Converter datas para formato de dia (YYYY-MM-DD) para comparação
        const diasUnicos = [...new Set(entradas.map(entrada => {
            const data = new Date(entrada.date);
            return data.toISOString().split('T')[0];
        }))].sort().reverse();

        if (diasUnicos.length === 0) {
            return 0;
        }

        // Verificar se o usuário fez entrada hoje ou ontem
        const hoje = new Date().toISOString().split('T')[0];
        const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        let diasConsecutivos = 0;
        let dataAtual = hoje;

        // Se não há entrada hoje, começar de ontem
        if (diasUnicos[0] !== hoje) {
            if (diasUnicos[0] === ontem) {
                dataAtual = ontem;
            } else {
                return 0; // Não há sequência atual
            }
        }

        // Contar dias consecutivos
        for (let i = 0; i < diasUnicos.length; i++) {
            if (diasUnicos[i] === dataAtual) {
                diasConsecutivos++;
                // Calcular o dia anterior
                const dataAnterior = new Date(dataAtual);
                dataAnterior.setDate(dataAnterior.getDate() - 1);
                dataAtual = dataAnterior.toISOString().split('T')[0];
            } else {
                break;
            }
        }

        return diasConsecutivos;
    } catch (error) {
        console.error('Erro ao calcular dias consecutivos:', error);
        return 0;
    }
}

// Função para contar total de entradas no diário
async function contarEntradasDiario(userId) {
    try {
        const totalEntradas = await Diary.countDocuments({ userId: userId });
        return totalEntradas;
    } catch (error) {
        console.error('Erro ao contar entradas do diário:', error);
        return 0;
    }
}

// Função para calcular percentual de humor positivo
async function calcularHumorPositivo(userId) {
    try {
        // Buscar todas as entradas do usuário
        const totalEntradas = await Diary.countDocuments({ userId: userId });
        
        if (totalEntradas === 0) {
            return 0;
        }

        // Contar entradas com humor positivo (feliz e contente)
        // Baseado no enum: ["yellow", "green", "default", "purple", "red", "blue"]
        // yellow = feliz, green = contente (humores positivos)
        const entradasPositivas = await Diary.countDocuments({ 
            userId: userId, 
            humor: { $in: ["yellow", "green"] }
        });

        // Calcular percentual
        const percentual = Math.round((entradasPositivas / totalEntradas) * 100);
        return percentual;
    } catch (error) {
        console.error('Erro ao calcular humor positivo:', error);
        return 0;
    }
}

router.get('/home', async (req, res) => {
    if (typeof req.session.userId == undefined || req.session.userId == null) {
        return res.redirect('/');
    }

    const username = req.session.username || "Usuário";
    const userId = req.session.userId;

    try {
        // Calcular dias consecutivos de uso
        const diasConsecutivos = await calcularDiasConsecutivos(userId);
        
        // Contar total de entradas no diário
        const totalEntradas = await contarEntradasDiario(userId);
        
        // Calcular percentual de humor positivo
        const humorPositivo = await calcularHumorPositivo(userId);

        res.render('Home/home', { 
            username, 
            currentPage: 'home',
            diasConsecutivos: diasConsecutivos,
            totalEntradas: totalEntradas,
            humorPositivo: humorPositivo
        });
    } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
        res.render('Home/home', { 
            username, 
            currentPage: 'home',
            diasConsecutivos: 0,
            totalEntradas: 0,
            humorPositivo: 0
        });
    }
});

module.exports = router;