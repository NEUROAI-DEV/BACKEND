import { Router } from 'express'
import { ArticleController } from '../controllers/article'

const router = Router()

router.get('/', ArticleController.findAll)
router.post('/', ArticleController.create)
router.patch('/', ArticleController.update)
router.delete('/', ArticleController.remove)

export default router
