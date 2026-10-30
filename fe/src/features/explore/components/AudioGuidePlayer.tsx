import { useRef, useState } from 'react';
import { FileText, Headphones, Pause, Play, Volume2 } from 'lucide-react';
import type { AudioGuideItem } from '../types/catalog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AudioGuideCardProps {
  guide: AudioGuideItem;
}

function AudioGuideCard({ guide }: AudioGuideCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  async function togglePlay() {
    const el = audioRef.current;
    if (!el || audioError) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setAudioError(true);
    }
  }

  function handleSeek(nextSeconds: number) {
    const el = audioRef.current;
    setCurrentTime(nextSeconds);
    if (el) {
      el.currentTime = nextSeconds;
    }
  }

  return (
    <div className="audio-guide-card">
      <div className="consent-title-row">
        <div>
          <h3>{guide.title}</h3>
          <p className="muted">{guide.description}</p>
        </div>
        <Badge>Phát trực tuyến · Tiếng Việt</Badge>
      </div>

      {guide.audioUrl && !audioError ? (
        <div className="audio-controls">
          <audio
            ref={audioRef}
            preload="metadata"
            src={guide.audioUrl}
            onLoadedMetadata={(event) => {
              const len = event.currentTarget.duration;
              if (Number.isFinite(len) && len > 0) setDuration(len);
            }}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
              setAudioError(true);
            }}
          />
          <Button
            type="button"
            variant={playing ? 'secondary' : 'primary'}
            onClick={() => void togglePlay()}
          >
            {playing ? (
              <>
                <Pause size={16} aria-hidden="true" />
                Tạm dừng thuyết minh
              </>
            ) : (
              <>
                <Play size={16} aria-hidden="true" />
                Phát thuyết minh
              </>
            )}
          </Button>
          <div className="audio-seek-field">
            <label htmlFor={`seek-${guide.id}`}>
              <Volume2 size={14} aria-hidden="true" /> Tua thời gian thuyết minh ({guide.title})
            </label>
            <input
              id={`seek-${guide.id}`}
              type="range"
              min={0}
              max={duration > 0 ? duration : 60}
              step={1}
              value={currentTime}
              onChange={(event) => handleSeek(Number(event.target.value))}
            />
          </div>
        </div>
      ) : (
        <p className="muted" role="status">
          {audioError
            ? 'Không thể tải tệp âm thanh trực tuyến lúc này. Bạn vẫn có thể đọc bản chép lời bên dưới.'
            : 'Chưa có bản thu âm thanh cho điểm đến này; vui lòng đọc bản chép lời bên dưới.'}
        </p>
      )}

      {guide.transcript ? (
        <div className="audio-transcript">
          <div className="consent-title-row">
            <strong>
              <FileText size={15} aria-hidden="true" /> Bản chép lời (Transcript)
            </strong>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowTranscript((prev) => !prev)}
            >
              {showTranscript ? 'Thu gọn bản chép lời' : 'Mở bản chép lời'}
            </Button>
          </div>
          {showTranscript && <p className="description-full">{guide.transcript}</p>}
        </div>
      ) : (
        <p className="muted">Chưa có bản chép lời được công bố.</p>
      )}
    </div>
  );
}

export function AudioGuidePlayer({ guides }: { guides: AudioGuideItem[] }) {
  return (
    <section className="content-card">
      <div className="card-header-inline">
        <Headphones size={22} aria-hidden="true" />
        <div>
          <h2>Thuyết minh âm thanh (Audio Guide)</h2>
          <p className="muted">
            Nghe giới thiệu điểm đến kèm bản chép lời đồng bộ ngôn ngữ (không tự động phát).
          </p>
        </div>
      </div>
      {guides.length === 0 ? (
        <p className="muted">Chưa có bản thuyết minh âm thanh được công bố cho địa điểm này.</p>
      ) : (
        <div className="consent-list">
          {guides.map((guide) => (
            <AudioGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </section>
  );
}
