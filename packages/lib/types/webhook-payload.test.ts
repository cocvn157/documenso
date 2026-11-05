import {
  DocumentDistributionMethod,
  DocumentSigningOrder,
  DocumentSource,
  DocumentStatus,
  DocumentVisibility,
  EnvelopeType,
} from '@prisma/client';
import { describe, expect, it } from 'vitest';

import { DEFAULT_DOCUMENT_DATE_FORMAT } from '../constants/date-formats';
import { DEFAULT_DOCUMENT_TIME_ZONE } from '../constants/time-zones';
import { mapEnvelopeToWebhookDocumentPayload } from './webhook-payload';

const createMockEnvelope = (
  documentMetaOverrides: Partial<{
    timezone: string | null;
    dateFormat: string | null;
  }> | null = {},
) => ({
  id: 'envelope_1',
  secondaryId: 'document_42',
  externalId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  completedAt: null,
  deletedAt: null,
  title: 'Example Contract.pdf',
  status: DocumentStatus.PENDING,
  source: DocumentSource.DOCUMENT,
  qrToken: null,
  internalVersion: 2,
  useLegacyFieldInsertion: false,
  authOptions: null,
  formValues: null,
  visibility: DocumentVisibility.EVERYONE,
  templateType: 'PRIVATE' as const,
  publicTitle: '',
  publicDescription: '',
  type: EnvelopeType.DOCUMENT,
  userId: 1,
  teamId: 1,
  templateId: null,
  folderId: null,
  recipients: [],
  documentMeta:
    documentMetaOverrides === null
      ? null
      : {
          id: 'meta_1',
          subject: null,
          message: null,
          timezone: 'Australia/Melbourne',
          password: null,
          dateFormat: 'dd/MM/yyyy',
          redirectUrl: null,
          signingOrder: DocumentSigningOrder.PARALLEL,
          allowDictateNextSigner: false,
          typedSignatureEnabled: true,
          uploadSignatureEnabled: true,
          drawSignatureEnabled: true,
          language: 'en',
          distributionMethod: DocumentDistributionMethod.EMAIL,
          emailSettings: null,
          emailId: null,
          emailReplyTo: null,
          ...documentMetaOverrides,
        },
});

describe('mapEnvelopeToWebhookDocumentPayload', () => {
  it('preserves documentMeta.timezone and documentMeta.dateFormat when set', () => {
    const payload = mapEnvelopeToWebhookDocumentPayload(
      createMockEnvelope({
        timezone: 'Australia/Melbourne',
        dateFormat: 'dd/MM/yyyy',
      }),
    );

    expect(payload.documentMeta?.timezone).toBe('Australia/Melbourne');
    expect(payload.documentMeta?.dateFormat).toBe('dd/MM/yyyy');
  });

  it('falls back to default timezone and dateFormat when documentMeta values are null', () => {
    const payload = mapEnvelopeToWebhookDocumentPayload(
      createMockEnvelope({
        timezone: null,
        dateFormat: null,
      }),
    );

    expect(payload.documentMeta?.timezone).toBe(DEFAULT_DOCUMENT_TIME_ZONE);
    expect(payload.documentMeta?.dateFormat).toBe(DEFAULT_DOCUMENT_DATE_FORMAT);
  });

  it('returns null documentMeta when envelope.documentMeta is null', () => {
    const payload = mapEnvelopeToWebhookDocumentPayload(createMockEnvelope(null));

    expect(payload.documentMeta).toBeNull();
  });
});
