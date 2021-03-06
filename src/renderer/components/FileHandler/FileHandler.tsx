import React from 'react';
import Helmet from 'react-helmet';
import path from 'path';
import { ipcRenderer, remote } from 'electron';
import { Subtitle } from '../../models/subtitle';

const { dialog } = remote;

interface Props {
  data: Subtitle[];
  filepath: string;
  needSave: boolean;
  loadVideo(path: string): void;
  loadData(param: { filepath: string; data: Subtitle[] }): void;
  newData(): void;
  saveData(param: { filepath: string; data: Subtitle[] }): void;
}

class FileHandler extends React.Component<Props> {
  handleOpenVideo = (event: Event, filepath: string) => {
    this.props.loadVideo(filepath);
  };

  handleOpenSubtitle = (event: Event, filepath: string, data: Subtitle[]) => {
    this.props.loadData({ filepath, data });
  };

  handleNewSubtitle = () => {
    this.props.newData();
  };

  handleSaveOrSaveAs = () => {
    // If data is never saved before,
    if (!this.props.filepath) {
      ipcRenderer.send('request-save-as-subtitle-dialog');
    } else {
      this.props.saveData({
        filepath: this.props.filepath,
        data: this.props.data,
      });
    }
  };

  handleSaveSubtitle = (event: Event, filepath: string) => {
    this.props.saveData({
      filepath,
      data: this.props.data,
    });
  };

  handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const { needSave } = this.props;

    if (needSave) {
      const browserWindow = remote.getCurrentWindow();

      const response = dialog.showMessageBox(browserWindow, {
        title: 'Jamak',
        message: 'Will you save the subtitle before close?',
        buttons: ['Save', 'Discard', 'Cancel'],
        cancelId: 2,
      });

      switch (response) {
        // Save
        case 0:
          this.handleSaveOrSaveAs();
          break;
        // Discard
        case 1:
          break;
        // Cancel
        case 2:
          event.returnValue = false;
          break;
        default:
          break;
      }
    }
  };

  componentDidMount() {
    ipcRenderer.on('open-video', this.handleOpenVideo);
    ipcRenderer.on('open-subtitle', this.handleOpenSubtitle);
    ipcRenderer.on('new-subtitle', this.handleNewSubtitle);
    ipcRenderer.on('save-or-save-as', this.handleSaveOrSaveAs);
    ipcRenderer.on('save-subtitle', this.handleSaveSubtitle);

    // Prevent close when the file needs save.
    window.onbeforeunload = this.handleBeforeUnload;
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('open-video', this.handleOpenVideo);
    ipcRenderer.removeListener('open-subtitle', this.handleOpenSubtitle);
    ipcRenderer.removeListener('new-subtitle', this.handleNewSubtitle);
    ipcRenderer.removeListener('save-or-save-as', this.handleSaveOrSaveAs);
    ipcRenderer.removeListener('save-subtitle', this.handleSaveSubtitle);

    window.onbeforeunload = null;
  }

  render() {
    const { filepath, needSave } = this.props;

    if (filepath) {
      return (
        <Helmet>
          <title>
            {needSave ? '● ' : ''}
            {path.basename(filepath)} - Jamak
          </title>
        </Helmet>
      );
    }

    return null;
  }
}

export default FileHandler;
