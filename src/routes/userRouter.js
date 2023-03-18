import express from 'express';
import passport from 'passport';
import { asyncWrapper, authenticate } from '../../utils/middleware.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';
import { kakaoLogin, kakaoCallback } from '../config/kakaoStrategy.js';
import { alreadyExists } from '../modules/user.module.js';

const router = express.Router();

// kakao 로그인
router.get('/auth/kakao', kakaoLogin);
router.get('/auth/kakao/callback', kakaoCallback, async (req, res) => {
    try {
        const { access_token, refresh_token, user } = req.user;
        console.log('AccessToken : ', access_token);
        console.log('RefreshToken : ', refresh_token);

        // 기존 회원 확인 후 새로 가입.
        await alreadyExists(user);
        res.cookie('access_token', access_token, { sameSite: 'none', secure: true });
        res.cookie('refresh_token', refresh_token, { sameSite: 'none', secure: true });
        res.status(201);
    } catch (err) {
        console.error(err);
        res.status(500).send({ errorMessage: err.message, stack: err.stack });
    }
});

// 회원
router.get('/api/user/profile', authenticate, asyncWrapper(getUserProfile));
router.post('/api/user/profile', () => {});

export { router };
