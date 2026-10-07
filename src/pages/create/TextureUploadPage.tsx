import { useNavigate } from 'react-router';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { UploadCard } from '../../components/image-picker/UploadCard';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { useImagePreparation } from '../../hooks/useImagePreparation';

export function TextureUploadPage() {
  const navigate = useNavigate();
  const textureImage = useGenerationStore((state) => state.textureImage);
  const setTextureImage = useGenerationStore((state) => state.setTextureImage);
  const { busy, error, handleFile, clearError } = useImagePreparation(setTextureImage);

  return (
    <CreateStepLayout
      step={1}
      title="Choose Your Surface"
      subtitle="Upload the tile, marble or texture you want to visualize."
      backTo="/create"
      footer={
        <Button fullWidth disabled={!textureImage || busy} onClick={() => navigate('/create/space')}>
          Continue
        </Button>
      }
    >
      <UploadCard
        title="Upload Surface"
        hint="Marble, ceramic tile, granite, wood or stone"
        imageUrl={textureImage?.previewUrl ?? null}
        busy={busy}
        error={error}
        onFile={handleFile}
        onRemove={() => {
          clearError();
          setTextureImage(null);
        }}
      />
    </CreateStepLayout>
  );
}
