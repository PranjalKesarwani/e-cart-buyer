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
});
