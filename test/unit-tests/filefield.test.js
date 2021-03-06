const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let {
  openBrowser,
  goto,
  fileField,
  closeBrowser,
  above,
  button,
  attach,
  setConfig,
} = require('../../lib/taiko');
let { createHtml, removeFile, openBrowserArgs, resetConfig } = require('./test-util');
const path = require('path');
const test_name = 'fileField';

describe(test_name, () => {
  let filePath;
  before(async () => {
    let innerHtml = `
        <form name="upload file">
            <div>
                <input id="file-upload" type="file" name="file">
                </br>
                <input class="button" id="file-submit" type="submit" value="Upload" />
            </div>
            <div>
                <label>
                    <input id="file-upload" type="file" name="file">
                    <span>Select a file</span>
                    <input class="button" id="file-submit" type="submit" value="Upload" />
                </label>
            </div>
            <div>
                <label for="file-upload">Choose a file</label>
                <input id="file-upload" type="file" name="file">
                <input class="button" id="file-submit" type="submit" value="Upload" />
            </div>
            <div>
                <label>Choose a file</label>
                <input id='hidden-file-upload' type='file' style="display:none">
            </div>
            <input type="file" value="similarFileField" id="similarFileField"/>
        </form>`;
    filePath = createHtml(innerHtml, test_name);
    await openBrowser(openBrowserArgs);
    await goto(filePath);
    setConfig({
      waitForNavigation: false,
      retryTimeout: 10,
      retryInterval: 10,
    });
  });
  after(async () => {
    resetConfig();
    await closeBrowser();
    removeFile(filePath);
  });
  describe('file field with type text', () => {
    describe('with inline text', () => {
      it('test exists()', async () => {
        expect(await fileField(above(button('Upload'))).exists()).to.be.true;
      });

      it('test value()', async () => {
        await attach(path.join(__dirname, 'data', 'foo.txt'), fileField(above(button('Upload'))));
        expect(await fileField(above(button('Upload'))).value()).to.include('foo.txt');
      });

      it('test value() should throw error if the element is not found', async () => {
        expect(fileField('foo').value()).to.be.eventually.rejected;
      });

      it('test description', async () => {
        expect(fileField(above(button('Upload'))).description).to.be.eql(
          'FileField Above Button with label Upload ',
        );
      });

      xit('test text()', async () => {
        expect(await fileField(above(button('Upload'))).text()).to.be.eql(
          'File field Above Button with label Upload ',
        );
      });

      it('test text should throw if the element is not found', async () => {
        expect(fileField('.foo').text()).to.be.eventually.rejected;
      });
    });
    describe('with wrapped text in label', () => {
      it('test exists()', async () => {
        expect(await fileField('Select a file').exists()).to.be.true;
      });

      it('test value()', async () => {
        await attach(path.join(__dirname, 'data', 'foo.txt'), fileField('Select a file'));
        expect(await fileField('Select a file').value()).to.include('foo.txt');
      });

      it('test description', async () => {
        expect(fileField('Select a file').description).to.be.eql(
          'FileField with label Select a file ',
        );
      });

      xit('test text()', async () => {
        expect(await fileField('Select a file').text()).to.be.eql(
          'File field with label Select a file ',
        );
      });
    });
    describe('using label for', () => {
      it('test exists()', async () => {
        expect(await fileField('Choose a file').exists()).to.be.true;
      });

      it('test value()', async () => {
        await attach(path.join(__dirname, 'data', 'foo.txt'), fileField('Select a file'));
        expect(await fileField('Choose a file').value()).to.include('foo.txt');
      });

      it('test description', async () => {
        expect(fileField('Choose a file').description).to.be.eql(
          'FileField with label Choose a file ',
        );
      });

      xit('test text()', async () => {
        expect(await fileField('Choose a file').text()).to.be.eql(
          'File field with label Choose a file ',
        );
      });
    });
  });
  describe('hidden', () => {
    it('exists when selectHiddenElements is provided', async () => {
      expect(await fileField({ id: 'hidden-file-upload' }, { selectHiddenElements: true }).exists())
        .to.be.true;
    });

    it('does not exists when selectHiddenElements is not provided', async () => {
      const exists = await fileField({
        id: 'hidden-file-upload',
      }).exists();
      expect(exists).to.be.false;
    });
  });

  describe('test elementList properties', () => {
    it('test get of elements', async () => {
      const elements = await fileField({
        id: 'similarFileField',
      }).elements();
      expect(elements[0].get()).to.be.a('string');
    });

    it('test description of elements', async () => {
      let elements = await fileField({
        id: 'similarFileField',
      }).elements();
      expect(elements[0].description).to.be.eql('FileField[id="similarFileField"]');
    });

    it('test value of elements', async () => {
      let elements = await fileField({
        id: 'similarFileField',
      }).elements();
      await attach(path.join(__dirname, 'data', 'foo.txt'), elements[0]);
      expect(await elements[0].value()).to.include('foo.txt');
    });

    xit('test text of elements', async () => {
      let elements = await fileField({
        id: 'similarFileField',
      }).elements();
      expect(await elements[0].text()).to.be.eql('similarFileField');
    });
  });

  describe('using a file that does not exists', () => {
    it('throws a error when the file does not exist', async () => {
      await expect(
        attach(path.join(__dirname, 'data', 'foowrong.txt'), fileField('Select a file')),
      ).to.be.rejectedWith(`File ${path.join(__dirname, 'data', 'foowrong.txt')} does not exist.`);
    });
  });
});
