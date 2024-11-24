import api from './api';

export interface TranscriptYoutube {
  text: string;
  time: number;
}

export interface VideoTitle {
  videoId: string;
  title: string;
  storyRange: number;
  startPoint: number;
  endPoint: number;
}

export interface Sentence {
  id: string;
  content: string;
  startTime: number;
  endTime: number;
  notes: string;
}

export type Transcript = VideoTitle & { sentences: Sentence[] };

type TranscriptRequest = Omit<Sentence, 'id'> & { videoId: string };

export const getTranscriptYoutube = async (videoId: string) => {
  const { data } = await api.get<TranscriptYoutube[]>(`/transcripts-youtube`, {
    params: {
      videoId,
    },
  });

  return data;
};

export const getTranscript = async (videoId: string) => {
  const { data } = await api.get<Transcript>(`/transcripts/${videoId}`);

  return data;
};

export const addTranscript = async (transcript: TranscriptRequest) => {
  const { data } = await api.post<Transcript[]>(`/api/transcripts-video`, transcript);

  return data;
};

export const updateTranscript = async (transcript: Sentence) => {
  const { data } = await api.put<Sentence[]>(`/api/transcripts-video`, transcript);

  return data;
};

export const deleteTranscriptSentence = async (id: string) => {
  const { data } = await api.delete(`transcript`, {
    params: {
      id,
    },
  });

  return data;
};

export const getTranscriptTitle = async () => {
  const { data } = await api.get<VideoTitle[]>(`/transcripts`, {});

  return data;
};

export const generateTranscript = async (videoId: string) => {
  const { data } = await api.post<Transcript>(`/transcripts/${videoId}`, {});

  return data;
};
