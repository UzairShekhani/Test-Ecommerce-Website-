import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'

const router = Router()

router.post('/', authRequired, async (req, res) => {
  const { items } = req.body
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  // Integrate with Stripe if STRIPE_SECRET present; for now, mock success
  res.json({ ok: true, total, message: 'Purchase successful' })
})

export default router



