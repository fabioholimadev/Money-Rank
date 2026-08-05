import {
  inputClassName,
  StudioField,
  StudioSection,
  textareaClassName,
} from './StudioFields';

const SLOT_LABELS = {
  video: 'Vídeo principal',
  slides: 'Slides',
  summary: 'Resumo / documento',
};

function updateSlot(payload, slotKey, field, value) {
  return {
    ...payload,
    materialSlots: {
      ...payload.materialSlots,
      [slotKey]: {
        ...payload.materialSlots?.[slotKey],
        [field]: value,
      },
    },
  };
}

function MaterialEditor({
  slotKey,
  material,
  disabled,
  uploading,
  onChange,
  onUpload,
}) {
  if (!material) return null;
  return (
    <StudioSection title={SLOT_LABELS[slotKey]} accent="cyan">
      <div className="grid gap-4 md:grid-cols-2">
        <StudioField label="Situação">
          <select
            className={inputClassName}
            value={material.status}
            disabled={disabled || slotKey === 'video'}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <option value="available">Publicado</option>
            <option value="pending">Aguardando material</option>
          </select>
        </StudioField>
        <StudioField label="Título">
          <input
            className={inputClassName}
            value={material.title ?? ''}
            disabled={disabled}
            onChange={(event) => onChange('title', event.target.value)}
          />
        </StudioField>
      </div>
      <StudioField label="Descrição">
        <textarea
          className={textareaClassName}
          value={material.description ?? ''}
          disabled={disabled}
          onChange={(event) => onChange('description', event.target.value)}
        />
      </StudioField>
      {material.status === 'available' && (
        <div className="grid gap-4 md:grid-cols-2">
          <StudioField
            label={slotKey === 'video' ? 'URL do vídeo' : 'URL incorporável'}
            hint={slotKey === 'video'
              ? 'Cole o link HTTPS comum do YouTube; ao salvar, o Estúdio o converte para /embed/.'
              : 'Use uma URL HTTPS que permita incorporação.'}
          >
            <input
              type="url"
              className={inputClassName}
              value={material.embedUrl ?? ''}
              disabled={disabled}
              onChange={(event) => onChange('embedUrl', event.target.value)}
            />
          </StudioField>
          {slotKey !== 'video' && (
            <StudioField
              label="URL do arquivo / documento"
              hint="Pode ser uma URL HTTPS ou um arquivo enviado ao Storage."
            >
              <input
                type="url"
                className={inputClassName}
                value={material.documentUrl ?? ''}
                disabled={disabled}
                onChange={(event) => onChange('documentUrl', event.target.value)}
              />
            </StudioField>
          )}
          <StudioField label="URL da fonte original" hint="Opcional, sempre HTTPS.">
            <input
              type="url"
              className={inputClassName}
              value={material.sourceUrl ?? ''}
              disabled={disabled}
              onChange={(event) => onChange('sourceUrl', event.target.value)}
            />
          </StudioField>
          <StudioField label="Formato">
            <input
              className={inputClassName}
              value={material.format ?? ''}
              disabled={disabled}
              onChange={(event) => onChange('format', event.target.value)}
            />
          </StudioField>
          <StudioField label="Tempo estimado (minutos)">
            <input
              type="number"
              min="1"
              max="180"
              className={inputClassName}
              value={material.estimatedMinutes ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onChange('estimatedMinutes', Number(event.target.value) || null)
              }
            />
          </StudioField>
        </div>
      )}
      {slotKey !== 'video' && material.status === 'available' && (
        <StudioField
          label="Enviar arquivo para o Firebase Storage"
          hint="PDF, PPT, PPTX, DOC ou DOCX, com até 8 MiB. O Capi Bank guardará somente os metadados e a URL."
        >
          <input
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            disabled={disabled || uploading}
            className={inputClassName}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = '';
            }}
          />
          {uploading && (
            <p className="mt-2 text-xs font-bold text-cyan-300" role="status">
              Validando e enviando arquivo...
            </p>
          )}
        </StudioField>
      )}
    </StudioSection>
  );
}

export default function LearningModuleEditor({
  payload,
  disabled,
  uploadingSlot,
  onChange,
  onUpload,
}) {
  return (
    <div className="space-y-4">
      <StudioSection title="Apresentação da fase">
        <StudioField label="Título exibido ao aluno">
          <input
            className={inputClassName}
            value={payload.title ?? ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...payload, title: event.target.value })}
          />
        </StudioField>
        <StudioField label="Descrição pedagógica">
          <textarea
            className={textareaClassName}
            value={payload.description ?? ''}
            disabled={disabled}
            onChange={(event) =>
              onChange({ ...payload, description: event.target.value })
            }
          />
        </StudioField>
      </StudioSection>

      {Object.entries(payload.materialSlots ?? {}).map(([slotKey, material]) => (
        <MaterialEditor
          key={slotKey}
          slotKey={slotKey}
          material={material}
          disabled={disabled}
          uploading={uploadingSlot === slotKey}
          onChange={(field, value) =>
            onChange(updateSlot(payload, slotKey, field, value))
          }
          onUpload={(file) => onUpload(slotKey, file)}
        />
      ))}
    </div>
  );
}
