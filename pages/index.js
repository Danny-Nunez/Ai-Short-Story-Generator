import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Input, Select, Button, Form, Space, Card, message, Modal } from "antd";
import { useState } from "react";
import request from "@/utils/request";
import { PlayCircleOutlined } from "@ant-design/icons";
import lottie from "lottie-web";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
const animationData = require("../public/ai-orb.json");

export default function Home() {
  const [isLoading, setLoadingTo] = useState(false);
  const [isLoadingAudio, setLoadingAudioTo] = useState(false);
  const [story, setStoryTo] = useState(null);
  const [image, setImageTo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const container = React.useRef(null);
  const [autoplay, setAutoplay] = useState(false);
  
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
  
  return (
  <>
    <Head>
      <title>AI Story Time</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <div className={styles.description}>
        <Space direction="vertical" size="large">
          <Card
            title=""
            style={{
              width: "400px",
              margin: "0 auto",
            }}
          >
            <div className={styles.lottie} ref={container}></div>
            <div className={styles.title}>Ai Story Generator</div>
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
                  <Select.Option value="write a disney story">
                    Disney Story
                  </Select.Option>
                  <Select.Option value="write a scary story">
                    Scary Story
                  </Select.Option>
                  <Select.Option value="write a romance story">
                    Romance Story
                  </Select.Option>
                  <Select.Option value="write a comedy story">
                    Comedy Story
                  </Select.Option>
                  <Select.Option value="write a fantasy story">
                    Fantasy Story
                  </Select.Option>
                  <Select.Option value="write a mystery story">
                    Mystery Story
                  </Select.Option>
                  <Select.Option value="write a thriller story">
                    Thriller Story
                  </Select.Option>
                  <Select.Option value="write a sci-fi story">
                    Sci-fi Story
                  </Select.Option>
                  <Select.Option value="write a western story">
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
                  placeholder="Plot twist of the story"
                  showCount
                />
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => setAutoplay(true)}
                  type="primary"
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
    <Modal width={600} visible={true} onCancel={handleModalClose} footer={null}>
      
      {/* <Card
        cover={image && <img src={image} alt="Your story" />}
        title="Your story"
        extra={
          <Button
            type="default"
            onClick={() => {
              playStory();
            }}
            loading={isLoadingAudio}
          >
            <PlayCircleOutlined /> Play story
          </Button>
        }
      ></Card> */}
      {/* <div className={styles.modalContent}>{story.type}</div> */}
      <div className={styles.imageWrap}><img src={image} alt="Your story" /></div>
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
