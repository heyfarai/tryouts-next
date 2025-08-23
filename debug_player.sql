-- Debug specific player ID: 10f1db93-015c-4883-a8a2-cce9eab80efb

-- 1. Check if player exists
SELECT p.id, p."firstName", p."lastName", p."checkInId" 
FROM "Player" p 
WHERE p.id = '10f1db93-015c-4883-a8a2-cce9eab80efb';

-- 2. Check player registrations
SELECT pr.id, pr."playerId", pr."registrationId", pr."checkedInAt", pr."checkedOutAt"
FROM "PlayerRegistration" pr 
WHERE pr."playerId" = '10f1db93-015c-4883-a8a2-cce9eab80efb';

-- 3. Check registration status and walk-in flag
SELECT r.id, r.status, r."isWalkIn", r."tryoutName", r."createdAt"
FROM "Registration" r
INNER JOIN "PlayerRegistration" pr ON r.id = pr."registrationId"
WHERE pr."playerId" = '10f1db93-015c-4883-a8a2-cce9eab80efb';

-- 4. Test the EXISTS condition from our query
SELECT EXISTS (
  SELECT 1 FROM "PlayerRegistration" pr2
  INNER JOIN "Registration" r2 ON pr2."registrationId" = r2.id
  WHERE pr2."playerId" = '10f1db93-015c-4883-a8a2-cce9eab80efb'
  AND (r2.status = 'COMPLETED' OR (r2.status = 'PENDING_PAYMENT' AND r2."isWalkIn" = true))
) as should_appear_in_list;

-- 5. Run the full query for just this player
SELECT 
  p.id,
  p."firstName",
  p."lastName", 
  p."checkInId",
  COALESCE(
    json_agg(
      json_build_object(
        'id', pr.id,
        'checkedInAt', pr."checkedInAt",
        'checkedOutAt', pr."checkedOutAt"
      )
      ORDER BY r."createdAt" DESC
    ) FILTER (WHERE r.status = 'COMPLETED' OR (r.status = 'PENDING_PAYMENT' AND r."isWalkIn" = true)),
    '[]'::json
  ) as registrations
FROM "Player" p
INNER JOIN "PlayerRegistration" pr ON p.id = pr."playerId"
INNER JOIN "Registration" r ON pr."registrationId" = r.id
WHERE p.id = '10f1db93-015c-4883-a8a2-cce9eab80efb'
AND EXISTS (
  SELECT 1 FROM "PlayerRegistration" pr2
  INNER JOIN "Registration" r2 ON pr2."registrationId" = r2.id
  WHERE pr2."playerId" = p.id 
  AND (r2.status = 'COMPLETED' OR (r2.status = 'PENDING_PAYMENT' AND r2."isWalkIn" = true))
)
GROUP BY p.id, p."firstName", p."lastName", p."checkInId";
