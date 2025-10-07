import {StyleSheet, View} from 'react-native';

// styles.ts
export const utils = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  p16: {
    padding: 16,
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export const PersonalChtatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1317',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1F2C34',
    borderBottomWidth: 0.5,
    borderBottomColor: '#222D34',
  },
  backButton: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  statusText: {
    color: '#8696A0',
    fontSize: 13,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 25,
  },
  listContent: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#005D4B',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#1F2C34',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    color: '#8696A0',
    fontSize: 12,
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#1F2C34',
  },
  plusButton: {
    marginHorizontal: 4,
  },
  cameraButton: {
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A3942',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: 'white',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00A884',
    borderRadius: 20,
    padding: 10,
    marginLeft: 4,
  },
  dateSeparatorContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#44444E',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: 'hidden',
  },
  replyContainer: {
    backgroundColor: '#02765c',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
    alignSelf: 'stretch',
  },
  replyTextWrapper: {
    flex: 1, // take all available space
  },

  replyContent: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1, // allow shrinking if needed
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 4,
    resizeMode: 'cover',
  },
  replyToContainer: {
    width: '100%',
    backgroundColor: '#152430', // light grey
    borderLeftWidth: 5,
    borderLeftColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  replyTextContainer: {
    flex: 1,
    paddingRight: 20, // space for close button
  },

  replyName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#02765c',
    marginBottom: 2,
  },

  replyMessage: {
    fontSize: 13,
    color: '#9c9c9c',
  },

  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 0,
    backgroundColor: '#fff', // darker grey
    borderRadius: 12,
  },
  replyThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginLeft: 8,
  },
  replyActionContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3942',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  audioText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1F2C34',
    flex: 1,
  },
  recordingText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 16,
  },
  recordingTimer: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  stopButton: {
    marginLeft: 'auto',
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    padding: 10,
  },
  replyContentContainerImage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
    paddingBottom: 5,
  },
  replyContentContainerText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  replyText: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1, // allow shrinking if needed
  },
});

export const VoiceChatStyles = StyleSheet.create({
  voiceModalContainer: {
    width: '100%',
    backgroundColor: '#15232B',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  visualizationBar: {
    width: 6,
    borderRadius: 3,
  },
  recordingTimer: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 32,
  },

  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    padding: 10,
    // borderRadius: '50%',
  },
  secondaryButton: {
    // backgroundColor: '#F5F5F5',
  },
  recordingActive: {
    backgroundColor: '#F44336',
    transform: [{scale: 1.1}],
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 16,
    // borderRadius: 8,
    // gap: 8,
  },
  cancelButton: {
    padding: 10,
    // borderRadius: '50%',
  },
  saveButton: {
    padding: 10,
    // borderRadius: '50%',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  micButton: {
    padding: 10,
    borderRadius: 30,
  },
  voiceModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // opposite walls
    alignItems: 'center', // vertical center
    paddingHorizontal: 12, // optional spacing from edges
    marginBottom: 16, // space below header
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    gap: 4,
  },
});
