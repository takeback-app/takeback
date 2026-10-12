-- Massa de demonstração do Desapega (fase 2) para homologação.
-- Ativa a funcionalidade e cria três anúncios ativos para o consumidor mais antigo.
-- Uso: psql "$DATABASE_URL" -f tests/fixtures/auction-listing-demo.sql
-- Remoção: DELETE FROM auctions WHERE title LIKE '[DEMO] %';

BEGIN;

UPDATE auction_settings SET "isEnabled" = true, "updatedAt" = now();

WITH seller AS (
  SELECT id FROM consumers ORDER BY "createdAt" LIMIT 1
),
demo (title, description, "startingBid", "highestBid", "bidsCount", hours, image) AS (
  VALUES
    ('[DEMO] Bicicleta aro 29', 'Bicicleta com pouco uso, revisada.', 300.00, 345.00, 4, 5,
     'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600'),
    ('[DEMO] Cadeira de escritório', 'Cadeira ergonômica com regulagem de altura.', 120.00, NULL, 0, 30,
     'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'),
    ('[DEMO] Violão folk', 'Acompanha capa e afinador.', 250.00, 260.00, 1, 47,
     'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600')
),
inserted AS (
  INSERT INTO auctions (
    "sellerId", title, description, "startingBid", "minimumIncrement",
    "highestBid", "bidsCount", status, "publishedAt", "endsAt", "updatedAt"
  )
  SELECT seller.id, demo.title, demo.description, demo."startingBid", 5.00,
         demo."highestBid", demo."bidsCount", 'ACTIVE', now(),
         now() + make_interval(hours => demo.hours), now()
  FROM seller, demo
  RETURNING id, title
)
INSERT INTO auction_images ("auctionId", url, "order")
SELECT inserted.id, demo.image, 0
FROM inserted
JOIN demo ON demo.title = inserted.title;

UPDATE auctions SET "attentionPoints" = 'Pequeno arranhão no quadro e pneu traseiro precisa ser calibrado.'
WHERE title = '[DEMO] Bicicleta aro 29';

INSERT INTO auction_images ("auctionId", url, "order")
SELECT auctions.id, extra.url, extra.ord
FROM auctions,
  (VALUES ('https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600', 1),
          ('https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=600', 2)) AS extra (url, ord)
WHERE auctions.title = '[DEMO] Bicicleta aro 29';

COMMIT;
