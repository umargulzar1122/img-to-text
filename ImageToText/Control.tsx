import * as  React from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Spin, Upload } from 'antd';
import { createWorker } from "tesseract.js";
import TextArea from 'antd/es/input/TextArea';
import { ControlProps } from './ControlProps';

const Control = ({ onGenerateText }: ControlProps) => {

  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageData, setImageData] = React.useState(null);

  React.useEffect(() => {
    if (text) {
      onGenerateText(text);
    }
  }, [text])

  React.useEffect(() => {
    (async () => {
      if (imageData != null) {
        setText("");
        setIsLoading(true);
        const worker = await createWorker('eng');
        const ret = await worker.recognize(imageData);
        console.log(ret.data.text);
        await worker.terminate();
        setText(ret.data.text);
        setIsLoading(false);
      }
    })()
  }, [imageData])

  return (
    <div>
      {
        isLoading &&
        <Spin fullscreen={true} spinning={isLoading} />
      }
      <Upload
        showUploadList={false}
        onChange={(e) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageDataUri = reader.result;
            console.log({ imageDataUri });
            setImageData(imageDataUri as any);
          };
          reader.readAsDataURL(e.file.originFileObj as any);
        }}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Upload
        </Button>
      </Upload>
      {
        text &&
        <TextArea variant='filled' value={text} />
      }
    </div >
  )
}

export default Control
