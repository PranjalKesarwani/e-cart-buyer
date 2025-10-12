import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Modal, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer, {
  AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
  RecordBackType,
  PlayBackType,
} from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {VoiceChatStyles as styles} from '../../theme/styles';
import RNFS from 'react-native-fs';
import {showToast} from '../../utils/toast';
import {IMedia} from '../../types';

const VoiceChat = ({
  newMessage,
  setNewMessage,
  setIsVoiceChatActive,
  isVoiceChatActive,
  handleSendMedia,
}: {
  newMessage: IMedia;
  setNewMessage: React.Dispatch<React.SetStateAction<IMedia>>;
  setIsVoiceChatActive: React.Dispatch<React.SetStateAction<boolean>>;
  isVoiceChatActive: boolean;
  handleSendMedia: (newMessage: IMedia) => Promise<void>;
}) => {
  // const [isVoiceModalVisible, setVoiceModalVisible] = useState(false);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'paused' | 'playing' | 'processing'
  >('idle');
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordedFilePath, setRecordedFilePath] = useState<string | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [visualizationData, setVisualizationData] = useState([
    1, 2, 3, 4, 5, 4, 3, 2,
  ]);
  const [isPlaybackPaused, setIsPlaybackPaused] = useState(false);

  const audioRecorderPlayer = useRef(AudioRecorderPlayer).current;
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const visualizationInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize modal state when it opens
  useEffect(() => {
    if (isVoiceChatActive) {
      if (newMessage.url) {
        setRecordedFilePath(newMessage.url);
      } else {
        setRecordedFilePath(null);
      }
      setRecordedTime(0);
      setPlaybackPosition(0);
      setPlaybackDuration(0);
      setRecordingState('idle');
      setIsPlaybackPaused(false);
    }
  }, [isVoiceChatActive, newMessage.url]);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
      clearIntervals();
    };
  }, []);

  const clearIntervals = () => {
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    if (visualizationInterval.current)
      clearInterval(visualizationInterval.current);
  };

  const checkMicrophonePermission = async () => {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    });

    if (!permission) return false;

    const status = await check(permission);
    if (status === RESULTS.GRANTED) return true;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const startRecording = async () => {
    const granted = await checkMicrophonePermission();
    if (!granted) {
      console.log('Microphone permission not granted.');
      return;
    }

    setRecordingState('processing');

    if (recordedFilePath) {
      try {
        const fileExists = await RNFS.exists(recordedFilePath);
        if (fileExists) {
          await RNFS.unlink(recordedFilePath);
          console.log(
            `Successfully deleted old recording file: ${recordedFilePath}`,
          );
        }
      } catch (error) {
        // Log the error but don't stop the new recording process
        console.error('Failed to delete old recording:', error);
      }
    }

    const path = Platform.select({
      ios: `${
        RNFS.CachesDirectoryPath
      }/seller_prod_${new Date().getTime()}.m4a`,
      android: `${
        RNFS.CachesDirectoryPath
      }/seller_prod_${new Date().getTime()}.m4a`,
    });

    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    };

    try {
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet, true);
      setRecordedFilePath(uri);
      setRecordingState('recording');
      setRecordedTime(0);
      setPlaybackPosition(0);
      setPlaybackDuration(0);

      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        setRecordedTime(e.currentPosition);
      });

      visualizationInterval.current = setInterval(() => {
        setVisualizationData(
          Array(8)
            .fill(0)
            .map(() => Math.floor(Math.random() * 5) + 1),
        );
      }, 200);
    } catch (error) {
      console.log('Recording start error:', error);
      setRecordingState('idle');
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
    } catch (err) {
      console.error('Failed to stop recorder:', err);
    } finally {
      audioRecorderPlayer.removeRecordBackListener();
      clearIntervals();
      setRecordingState('idle');
    }
  };

  const startPlayback = async () => {
    if (!recordedFilePath) return;
    try {
      setRecordingState('processing');
      console.log('Starting playback for:', recordedFilePath);

      const stats = await RNFS.stat(recordedFilePath);
      console.log('-------}}}}}}}}}}}}}>>>>>>', stats);
      if (isPlaybackPaused) {
        console.log('Resuming playback');
        await audioRecorderPlayer.resumePlayer();
      } else {
        console.log('Starting playback');
        const msg = await audioRecorderPlayer.startPlayer(
          `file://${recordedFilePath}`,
        );
        console.log('Playback started:', msg);
      }

      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        setPlaybackPosition(e.currentPosition);
        setPlaybackDuration(e.duration);
        if (e.currentPosition >= e.duration) {
          stopPlayback();
        }
      });

      setRecordingState('playing');
      setIsPlaybackPaused(false);
    } catch (err) {
      console.error('Playback failed:', err);
      setRecordingState('idle');
    }
  };

  const pausePlayback = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setRecordingState('paused');
      setIsPlaybackPaused(true);
    } catch (err) {
      console.error('Pause playback failed:', err);
    }
  };

  const stopPlayback = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    } catch (err) {
      console.error('Stop playback failed:', err);
    } finally {
      setRecordingState('idle');
      setPlaybackPosition(0);
      setIsPlaybackPaused(false);
    }
  };

  const resetRecording = () => {
    stopRecording();
    stopPlayback();
    setRecordedFilePath(null);
    setRecordedTime(0);
    setPlaybackPosition(0);
    setPlaybackDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getDisplayTime = () => {
    if (recordingState === 'recording' || recordingState === 'paused') {
      return formatTime(Math.floor(recordedTime / 1000));
    }
    if (recordedFilePath && playbackDuration > 0) {
      const position = Math.floor(playbackPosition / 1000);
      const duration = Math.floor(playbackDuration / 1000);
      return `${formatTime(position)} / ${formatTime(duration)}`;
    }
    return '00:00';
  };

  const resumeRecording = async () => {
    try {
      await audioRecorderPlayer.resumeRecorder();
      setRecordingState('recording');

      visualizationInterval.current = setInterval(() => {
        setVisualizationData(
          Array(8)
            .fill(0)
            .map(() => Math.floor(Math.random() * 5) + 1),
        );
      }, 200);
    } catch (error) {
      console.error('Resume recording failed', error);
    }
  };

  const pauseRecording = async () => {
    try {
      await audioRecorderPlayer.pauseRecorder();
      setRecordingState('paused');

      if (visualizationInterval.current) {
        clearInterval(visualizationInterval.current);
        visualizationInterval.current = null;
      }
    } catch (error) {
      console.error('Pause recording failed', error);
    }
  };

  const handlePrimaryButtonPress = () => {
    if (recordingState === 'idle') {
      startRecording();
    } else if (recordingState === 'recording') {
      pauseRecording();
    } else if (recordingState === 'paused') {
      resumeRecording();
    }
  };

  const handleSaveRecording = async () => {
    try {
      // Stop any active recording first
      if (recordingState === 'recording' || recordingState === 'paused') {
        await stopRecording();
      }

      // Stop playback if it's currently playing
      if (recordingState === 'playing') {
        await stopPlayback();
      }
      const stats = await RNFS.stat(recordedFilePath as string);
      // Update form data only after file is finalized
      setNewMessage({
        url: recordedFilePath as string,
        fileName:
          recordedFilePath?.split('/').pop() || `recording_${Date.now()}.m4a`,
        type: 'audio/m4a',
        size: Number(stats.size),
      });
      await handleSendMedia({
        url: `file://${recordedFilePath as string}`,
        fileName:
          recordedFilePath?.split('/').pop() || `recording_${Date.now()}.m4a`,
        type: 'audio/m4a',
        size: Number(stats.size),
      });
      // Close the modal
      // setIsVoiceChatActive(false);
    } catch (error: any) {
      console.error('Failed to save recording:', error);
      showToast('error', `Failed to save recording: ${error.message}`);
    }
  };

  return (
    <>
      <View style={styles.voiceModalContainer}>
        <View style={[styles.voiceModalHeader]}>
          <View style={[styles.recordingControls]}>
            {recordingState === 'recording' ? (
              <Text style={styles.recordingTimer}>{getDisplayTime()}</Text>
            ) : (
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  styles.secondaryButton,
                  {opacity: recordedFilePath ? 1 : 0.5},
                ]}
                disabled={!recordedFilePath}
                onPress={() => {
                  if (recordingState === 'playing') {
                    pausePlayback();
                  } else {
                    startPlayback();
                  }
                }}>
                <Icon
                  name={recordingState === 'playing' ? 'pause' : 'play-arrow'}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.visualizationContainer]}>
            {visualizationData.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.visualizationBar,
                  {
                    height: height * 5,
                    backgroundColor:
                      recordingState === 'recording'
                        ? '#FF5722'
                        : recordingState === 'paused'
                        ? '#FF9800' // Orange for paused recording
                        : recordingState === 'playing'
                        ? '#2196F3'
                        : '#E0E0E0',
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              resetRecording();
              setIsVoiceChatActive(false);
            }}>
            <Icon name="delete" size={30} color="#F44336" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.micButton]}
            onPress={handlePrimaryButtonPress}>
            <Icon
              name={recordingState === 'recording' ? 'pause' : 'mic'}
              size={30}
              color="red"
              style={[]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            disabled={!recordedFilePath}
            onPress={() => {
              handleSaveRecording();
            }}>
            <Icon style={[]} name="send" size={30} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default VoiceChat;
