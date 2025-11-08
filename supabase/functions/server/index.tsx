import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();
app.use('*', cors(), logger(console.log));

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

async function verifyAuth(authHeader: string | null) {
    if (!authHeader) return { error: 'No authorization header', userId: null };
    const token = authHeader.split(' ')[1];
    if (!token) return { error: 'No token', userId: null };
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error || !user?.id ? { error: 'Unauthorized', userId: null } : { error: null, userId: user.id };
}

app.post('/make-server-4c8d5f20/signup', async (c) => {
    try {
        const { email, password, name } = await c.req.json();
        if (!email || !password || !name) return c.json({ error: 'Email, password, and name required' }, 400);

        const { data, error } = await supabase.auth.admin.createUser({
            email, password, user_metadata: { name }, email_confirm: true
        });

        if (error) return c.json({ error: error.message }, 400);
        return c.json({ success: true, user: { id: data.user?.id, email: data.user?.email, name: data.user?.user_metadata?.name } });
    } catch (error) {
        return c.json({ error: 'Signup failed' }, 500);
    }
});

app.get('/make-server-4c8d5f20/products', async (c) => {
    const { error, userId } = await verifyAuth(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    try {
        const products = await kv.getByPrefix(`products:${userId}:`);
        return c.json({ products: products || [] });
    } catch (error) {
        return c.json({ error: 'Failed to fetch products' }, 500);
    }
});

app.post('/make-server-4c8d5f20/products', async (c) => {
    const { error, userId } = await verifyAuth(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    try {
        const { name, category, quantity, minStock } = await c.req.json();
        if (!name || !category || quantity === undefined || minStock === undefined) {
            return c.json({ error: 'All fields required' }, 400);
        }
        const productId = crypto.randomUUID();
        const product = { id: productId, name, category, quantity: Number(quantity), minStock: Number(minStock), userId, createdAt: new Date().toISOString() };
        await kv.set(`products:${userId}:${productId}`, product);
        return c.json({ product });
    } catch (error) {
        return c.json({ error: 'Failed to create product' }, 500);
    }
});

app.put('/make-server-4c8d5f20/products/:id', async (c) => {
    const { error, userId } = await verifyAuth(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    try {
        const productId = c.req.param('id');
        const { quantity } = await c.req.json();
        if (quantity === undefined) return c.json({ error: 'Quantity required' }, 400);

        const existing = await kv.get(`products:${userId}:${productId}`);
        if (!existing) return c.json({ error: 'Product not found' }, 404);

        const updated = { ...existing, quantity: Number(quantity), updatedAt: new Date().toISOString() };
        await kv.set(`products:${userId}:${productId}`, updated);
        return c.json({ product: updated });
    } catch (error) {
        return c.json({ error: 'Failed to update product' }, 500);
    }
});

app.delete('/make-server-4c8d5f20/products/:id', async (c) => {
    const { error, userId } = await verifyAuth(c.req.header('Authorization'));
    if (error) return c.json({ error }, 401);
    try {
        await kv.del(`products:${userId}:${c.req.param('id')}`);
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: 'Failed to delete product' }, 500);
    }
});

app.get('/make-server-4c8d5f20/health', (c) => c.json({ status: 'ok' }));

Deno.serve(app.fetch);
