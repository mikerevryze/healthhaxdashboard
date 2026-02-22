# Meta Ads API Token Setup

## The Problem

The Meta Ads to Snowflake n8n workflow (`CL_HealthHax_Meta_Ads_Daily`) uses a Meta access token to call the Graph API. If this token expires, the workflow fails with:

```
Error validating access token: Session has expired on ...
OAuthException, code 190, error_subcode 463
```

## Token Types

| Token Type | Lifetime | Use Case |
|---|---|---|
| Short-lived User Token | ~1-2 hours | Testing only |
| Long-lived User Token | ~60 days | Temporary automation |
| **System User Token** | **Never expires** | **Production automation** |

## Recommended: System User Token (Never Expires)

1. Go to [Meta Business Settings](https://business.facebook.com/settings/system-users)
2. Navigate to **Users** > **System Users**
3. Create a new System User (or use an existing one):
   - Name: e.g. `n8n-ads-reader`
   - Role: **Employee** is sufficient for read-only ads access
4. Click **Add Assets** and grant access to your Ad Account with `ads_read` permission
5. Click **Generate New Token**:
   - Select your Meta App
   - Check the `ads_read` permission (and `ads_management` if needed)
   - Click **Generate Token**
6. Copy the token and update the **Config** node in the n8n workflow

## Fallback: Long-Lived User Token (60 Days)

If you can't use a System User, exchange a short-lived token for a long-lived one:

```
GET https://graph.facebook.com/v21.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id={APP_ID}&
  client_secret={APP_SECRET}&
  fb_exchange_token={SHORT_LIVED_TOKEN}
```

Set a reminder to refresh this token before it expires (every ~55 days).

## Updating the Token in n8n

1. Open the **CL_HealthHax_Meta_Ads_Daily** workflow in n8n
2. Open the **Config** node
3. Replace the `access_token` value with the new token
4. Save and execute the workflow to verify it works

## Verifying a Token

Check if a token is valid and when it expires:

```
GET https://graph.facebook.com/debug_token?
  input_token={TOKEN_TO_CHECK}&
  access_token={TOKEN_TO_CHECK}
```

The response includes `expires_at` (0 means it never expires for System User tokens).
