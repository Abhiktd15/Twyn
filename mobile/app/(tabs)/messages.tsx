import { View, Text, Alert, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { CONVERSATIONS, ConversationType } from '@/constants/conversations';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const Messages = () => {
  const inset = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("");
  const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const deleteConversation = (conversationId: number) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setConversationsList(prev => prev.filter(conv => conv.id !== conversationId));
        }
      }
    ])
  }
  const openConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  }
  const closeConversation = () => {
    setSelectedConversation(null);
    setIsChatOpen(false);
    setNewMessage("")
  }

  const sendMessage = () => {
    if(newMessage.trim() && selectedConversation) {
      // Update last message in conversations list
      setConversationsList((prev) => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: newMessage,time : "now"} 
            : conv
        )
      )
      setNewMessage("")
      Alert.alert("Message Sent", `Your message has been sent to ${selectedConversation.user.name}.`);
    }
  }
  
  return (
    <View className='flex-1 '>
      {/* Header */}
      <View className='flex flex-row items-center justify-between px-4 py-3 border-b border-gray-200'>
        <Text className='text-xl font-bold'>Messages</Text>
        <TouchableOpacity>
          <Feather name='edit' size={20} color='#1DA1F2' />
        </TouchableOpacity>
      </View>
      <View className='px-4 py-3 border-b border-gray-200'>
        <View className='flex flex-row items-center bg-gray-200  rounded-full px-4 py-3 '>
            <Feather name='search' size={20} color='gray' />
            <TextInput
                placeholder='Search for people and groups...'
                className='flex-1 ml-3 text-base '
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>
      </View>

      {/* Messages list */}
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {conversationsList.map(conversation => (
          <TouchableOpacity
            key={conversation.id}
            className='flex flex-row items-center px-4 py-3 border-b border-gray-200'
            onPress={() => openConversation(conversation)}
            onLongPress={() => deleteConversation(conversation.id)}
          >
            <View className='w-12 h-12 rounded-full bg-gray-300 mr-3 overflow-hidden'>
              {conversation.user.avatar ? (
                <Image
                  source={{ uri: conversation.user.avatar }}
                  className='w-full h-full'
                />
              ) : (
                <View className='w-full h-full bg-gray-300' />
              )}
            </View>
            <View className='flex-1'>
              <View className='flex flex-row items-center justify-between'>
                <View className='flex flex-row items-center gap-1'>
                  <Text className='text-lg font-semibold text-gray-900'>
                    {conversation.user.name}
                  </Text>
                  {conversation.user.verified && (
                    <Feather name='check-circle' size={14} color='#1DA1F2' />
                  )}
                  <Text className='text-gray-500 text-sm'>@{conversation.user.username}</Text>
                </View>
                <Text className='text-gray-500 text-sm'>{conversation.time}</Text>
              </View>
              <Text className='text-gray-500 text-sm'>{conversation.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom  */}
      <View className='px-4 py-2 border-t border-gray-300 bg-gray-200'> 
        <Text className='text-center text-gray-500 text-xs'>Tap to open . Long Press to delete</Text>
      </View> 

      {/* Chat View */}
      <Modal visible={isChatOpen} animationType='slide' presentationStyle='pageSheet'>
        {selectedConversation && (
          <SafeAreaView className="flex-1">
            {/* Chat Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
              <TouchableOpacity onPress={closeConversation} className="mr-3">
                <Feather name="arrow-left" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedConversation.user.avatar }}
                className="size-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-900 mr-1">
                    {selectedConversation.user.name}
                  </Text>
                  {selectedConversation.user.verified && (
                    <Feather name="check-circle" size={16} color="#1DA1F2" />
                  )}
                </View>
                <Text className="text-gray-500 text-sm">@{selectedConversation.user.username}</Text>
              </View>
            </View>

            {/* Messages Area */}
            <ScrollView className="flex-1 px-4 py-4">
              <View className="mb-4">
                <Text className="text-center text-gray-400 text-sm mb-4">
                  This is the beginning of your conversation with {selectedConversation.user.name}
                </Text>

                {/* Conversation Messages */}
                {selectedConversation.messages.map((message) => (
                  <View
                    key={message.id}
                    className={`flex-row mb-3 ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectedConversation.user.avatar }}
                        className="size-8 rounded-full mr-2"
                      />
                    )}
                    <View className={`flex-1 ${message.fromUser ? "items-end" : ""}`}>
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-xs ${
                          message.fromUser ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <Text className={message.fromUser ? "text-white" : "text-gray-900"}>
                          {message.text}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-400 mt-1">{message.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Message Input */}
            <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
                <TextInput
                  className="flex-1 text-base"
                  placeholder="Start a message..."
                  placeholderTextColor="#657786"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
              </View>
              <TouchableOpacity
                onPress={sendMessage}
                className={`size-10 rounded-full items-center justify-center ${
                  newMessage.trim() ? "bg-blue-500" : "bg-gray-300"
                }`}
                disabled={!newMessage.trim()}
              >
                <Feather name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </View>
  )
}

export default Messages