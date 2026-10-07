import { Navigate, useNavigate } from 'react-router';
import { CreateStepLayout } from '../../components/layout/CreateStepLayout';
import { UploadCard } from '../../components/image-picker/UploadCard';
import { Button } from '../../components/buttons/Button';
import { useGenerationStore } from '../../store/generationStore';
import { useImagePreparation } from '../../hooks/useImagePreparation';

export function RoomUploadPage() {
  const navigate = useNavigate();
  const textureImage = useGenerationStore((state) => state.textureImage);
  const roomImage = useGenerationStore((state) => state.roomImage);
  const setRoomImage = useGenerationStore((state) => state.setRoomImage);
  const { busy, error, handleFile, clearError } = useImagePreparation(setRoomImage);

  // Step 1 must be completed first (e.g. if this page was opened directly).
  if (!textureImage) return <Navigate to="/create/surface" replace />;

  return (
    <CreateStepLayout
      step={2}
      title="Choose Your Space"
      subtitle="Upload a photo of the room, wall or floor you want to transform."
      backTo="/create/surface"
      footer={
        <Button fullWidth disabled={!roomImage || busy} onClick={() => navigate('/create/vision')}>
          Continue
        </Button>
      }
    >
      <UploadCard
        title="Choose Room Image"
        hint="Bedroom, living room, bathroom, kitchen, floor or wall"
        imageUrl={roomImage?.previewUrl ?? null}
        busy={busy}
        error={error}
        onFile={handleFile}
        onRemove={() => {
          clearError();
          setRoomImage(null);
        }}
      />
    </CreateStepLayout>
  );
}
