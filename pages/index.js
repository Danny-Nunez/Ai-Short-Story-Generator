import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Input, Select, Button, Form, Space, Card, message, Modal } from "antd";
import { useState } from "react";
import request from "@/utils/request";
import { PoweroffOutlined } from "@ant-design/icons";
import lottie from "lottie-web";
import React from "react";
import { PDFDownloadLink, Document, Page, Text, Image, View } from '@react-pdf/renderer';

const inter = Inter({ subsets: ["latin"] });
const animationData = require("../public/story-icon.json");

export default function Home() {
  const [isLoading, setLoadingTo] = useState(false);
  const [isLoadingAudio, setLoadingAudioTo] = useState(false);
  const [story, setStoryTo] = useState(null);
  const [image, setImageTo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const container = React.useRef(null);
  const [autoplay, setAutoplay] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [title, setTitle] = useState(null);
  const [mainCharacterName, setMainCharacterName] = useState(null);

  
  const onFinish = async (values) => {
    setLoadingTo(true);

    try {
      const response = await request("generate-story", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response) {
        setStoryTo(response.story);
        setImageTo(response.image);
        setIsModalVisible(true);
        setSelectedStory(values.type);
        setMainCharacterName(values.mainCharacterName);
        setTitle(`Generated ${values.type} Story`);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoadingTo(false);
    }
  };

  const playStory = async () => {
    setLoadingAudioTo(true);

    try {
      const response = await request("play-story", {
        method: "POST",
        body: JSON.stringify({ story }),
      });

      if (response && response.audio) {
        const audioBuffer = response.audio;
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      setLoadingAudioTo(false);
    }
  };

  React.useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      animationData: animationData,
      loop: true,
      autoplay: autoplay,
      renderer: "svg", // or 'canvas', 'html'
    });

    return () => anim.destroy(); // cleanup on unmount
  }, [autoplay]);

  
  const handleModalClose = () => {
    setIsModalVisible(false);
    setStoryTo(null);
    setAutoplay(false);
    console.log('Modal closed');
  };
 

  const MyDoc = ({ story, image }) => (
    <Document>
      <Page style={{ paddingTop: 35, paddingBottom: 65, paddingHorizontal: 35 }}>
        
        <Image style={{ width: '530px', height: '212px', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }} src="http://localhost:3000/aibanner.jpeg" />
        <View style={{ textAlign: 'center' }}>
        <Text style={{ fontSize: '18px', fontStyle: 'bold', paddingTop: 20 }}>{selectedStory} about {mainCharacterName}</Text>
        <Text style={{ fontSize: '13px' }}>{story}</Text>
        </View>
        <Text style={{ position: 'absolute', fontSize: 12, bottom: 30, left: 0, right: 0, textAlign: 'center', color: 'grey'  }} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      </Page>
    </Document>
  );
  
  
  return (
  <>
    <Head>
      <title>Ai Short Story Generator</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <div className={styles.description}>
        <Space className={styles.shellWrap} direction="vertical" size="large">
          <Card
          className={styles.shell}
            title=""
            style={{
              
              margin: "0 auto",
              borderRadius: "15px",
              
            }}
          >
            <div className={styles.lottie} ref={container}></div>
            <div className={styles.title}>Ai Short Story Generator</div>
            <Form onFinish={onFinish} layout="vertical" name="basic">
              <Form.Item
                label="Select a story style"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Select your story style!",
                  },
                ]}
              >
                <Select placeholder="Select your story style">
                  <Select.Option value="A Disney Story">
                    Disney Story
                  </Select.Option>
                  <Select.Option value="A Scary Story">
                    Scary Story
                  </Select.Option>
                  <Select.Option value="A Romance Story">
                    Romance Story
                  </Select.Option>
                  <Select.Option value="A Comedy Story">
                    Comedy Story
                  </Select.Option>
                  <Select.Option value="A Fantasy Story">
                    Fantasy Story
                  </Select.Option>
                  <Select.Option value="A Mystery Story">
                    Mystery Story
                  </Select.Option>
                  <Select.Option value="A Thriller Story">
                    Thriller Story
                  </Select.Option>
                  <Select.Option value="A Sci-fi Story">
                    Sci-fi Story
                  </Select.Option>
                  <Select.Option value="A Western Story">
                    Western Story
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Main character name"
                name="mainCharacterName"
                rules={[
                  { required: true, message: "Main character name!" },
                ]}
              >
                <Input placeholder="Main character name" />
              </Form.Item>
              <Form.Item
                label="Main character skills"
                name="mainCharacterSkills"
                rules={[
                  { required: true, message: "Main character skills!" },
                ]}
              >
                <Input placeholder="Main character skills" />
              </Form.Item>
              <Form.Item
                label="Plots of the story"
                name="plot"
                rules={[{ required: true, message: "Plots of the story!" }]}
              >
                <Input.TextArea
                  placeholder="Plot of the story"
                  showCount
                />
              </Form.Item>
              <Form.Item>
                <Button 
                
                  onClick={() => setAutoplay(true)}
                  
                  icon={<PoweroffOutlined />}
                  htmlType="submit"
                  loading={isLoading}
                >
                  Generate my story
                </Button>
              </Form.Item>
            </Form>
          </Card>

<div className={styles.modalContainer}>

  {story && (
    <Modal 
    width={600} visible={true} onCancel={handleModalClose} footer={null}>  

<div>
<div className={styles.button}>
    <PDFDownloadLink document={<MyDoc story={story} image={image} />} fileName="YourStory.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download Your Story'
      }
    </PDFDownloadLink>
    </div>

      <div className={styles.imageWrap}><img src={image} alt="Your story" /></div>
      </div>
  <div className={styles.storyTitle}><p>{selectedStory} about {mainCharacterName}</p>
  </div>
        <pre className={styles.container}>{story}</pre>
    </Modal>
  )}
</div>
        </Space>
      </div>
    </main>
        </>
      );
    }
