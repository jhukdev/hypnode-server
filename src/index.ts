import { Tag, INode } from 'hypnode';

/* -----------------------------------
 *
 * IAttrs
 *
 * -------------------------------- */

interface IAttrs {
   [index: string]: any;
}

/* -----------------------------------
 *
 * Variables
 *
 * -------------------------------- */

const selfClosing = [
   'area',
   'base',
   'br',
   'col',
   'embed',
   'hr',
   'img',
   'input',
   'link',
   'meta',
   'param',
   'source',
   'track',
   'wbr',
];

/* -----------------------------------
 *
 * Render
 *
 * -------------------------------- */

function render(node: INode): string {
   return renderElementNode(node);
}

/* -----------------------------------
 *
 * Node
 *
 * -------------------------------- */

function renderElementNode(node: INode | string): string {
   if (typeof node === 'string') {
      return node;
   }

   const { tag, attrs, children } = node;

   return (
      openElementTag(tag, attrs) +
      children.map((child: INode) => renderElementNode(child)).join('') +
      closeElementTag(tag)
   );
}

/* -----------------------------------
 *
 * Open
 *
 * -------------------------------- */

function openElementTag(name: Tag, attrs: IAttrs): string {
   let result = `<${name + applyNodeProperties(attrs)}`;

   if (selfClosing.indexOf(name as string) < 0) {
      result += '>';
   }

   return result;
}

/* -----------------------------------
 *
 * Attributes
 *
 * -------------------------------- */

function applyNodeProperties(attrs: IAttrs) {
   const keys = Object.keys(attrs);

   if (!keys.length) {
      return '';
   }

   const result = keys
      .map(key => addElementAttributes(key, attrs[key]))
      .filter(item => !!item);

   return result.length ? ` ${result.join(' ')}` : '';
}

/* -----------------------------------
 *
 * Props
 *
 * -------------------------------- */

function addElementAttributes(key: string, value: any) {
   if (key.startsWith('on') || key === 'ref') {
      return '';
   }

   if (['disabled', 'autocomplete', 'selected', 'checked'].indexOf(key) > -1) {
      return `${key}="${key}"`;
   }

   if (!value) {
      return '';
   }

   if (key === 'style') {
      return `${key}="${addStyleProperties(value)}"`;
   }

   if (key === 'className') {
      key = 'class';
   }

   return `${key}="${value}"`;
}

/* -----------------------------------
 *
 * Styles
 *
 * -------------------------------- */

function addStyleProperties(value: IAttrs) {
   const items = Object.keys(value);

   const result = items.reduce((style, key) => {
      const name = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

      style += `${name}:${value[key]};`;

      return style;
   }, '');

   return result;
}

/* -----------------------------------
 *
 * Close
 *
 * -------------------------------- */

function closeElementTag(name: Tag): string {
   if (selfClosing.indexOf(name as string) > -1) {
      return ' />';
   }

   return `</${name}>`;
}

/* -----------------------------------
 *
 * Export
 *
 * -------------------------------- */

export { render };
