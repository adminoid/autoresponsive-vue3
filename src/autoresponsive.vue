<template>
  <div ref="container" :class="`${prefixClassName}-container`" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import {
  GridSort
} from 'autoresponsive-core3';
import pkg from '../package';
import AnimationManager from './animation';
import {onBeforeMount, onMounted, onUpdated, ref} from "vue";

const props = defineProps({
  containerWidth: {
    type: Number,
    default: null
  },
  containerHeight: {
    type: Number,
    default: null
  },
  gridWidth: {
    type: Number,
    default: 10
  },
  prefixClassName: {
    type: String,
    default: pkg.name
  },
  itemClassName: {
    type: String,
    default: 'item'
  },
  itemMargin: {
    type: Number,
    default: 0
  },
  horizontalDirection: {
    type: String,
    default: 'left'
  },
  transitionDuration: {
    type: [String, Number],
    default: 1
  },
  transitionTimingFunction: {
    type: String,
    default: 'linear'
  },
  verticalDirection: {
    type: String,
    default: 'top'
  },
  closeAnimation: {
    type: Boolean,
    default: false
  },
  onItemDidLayout: {
    type: Function,
    default: () => {}
  },
  onContainerDidLayout: {
    type: Function,
    default: () => {}
  }
});

const containerStyle = {
  position: 'relative'
};

let animationManager, fixedContainerHeight;
onBeforeMount(() => {
  animationManager = new AnimationManager();
  fixedContainerHeight = typeof props.containerHeight === 'number';
})

const mixItemInlineStyle = (s) => {
  const itemMargin = props.itemMargin;
  let style = {
    display: 'block',
    float: 'left',
    margin: `0 ${itemMargin}px ${itemMargin}px 0`
  };

  if (props.containerWidth) {
    style = {
      position: 'absolute'
    };
  }
  Object.assign(s, style);
}

const container = ref(null);

const updateChildren = () => {
  const sortManager = new GridSort({
    containerWidth: props.containerWidth,
    gridWidth: props.gridWidth
  });
  sortManager.init();

  let containerHeight = props.verticalDirection === 'bottom' || fixedContainerHeight ? props.containerHeight : 0;

  const children = container.value.children;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const canvas = node.__vnode.el;

    let style = {};
    switch (canvas.style.constructor.name) {
      case 'CSS2Properties':
        Object.values(canvas.style).forEach((prop) => {
          style[prop] = canvas.style[prop];
        });
        break;
      case 'CSSStyleDeclaration':
        style = canvas.style;
        break;
    }

    if (node.className &&
        props.itemClassName &&
        !~node.className.indexOf(props.itemClassName)) {
      return;
    }

    const childWidth = parseInt(style.width, 10) + props.itemMargin;
    const childHeight = parseInt(style.height, 10) + props.itemMargin;
    const calculatedPosition = sortManager.getPosition(childWidth, childHeight);

    if (fixedContainerHeight) {
      container.value.style.height = `${containerHeight}px`;
    } else {
      if (calculatedPosition[1] + childHeight > containerHeight) {
        containerHeight = calculatedPosition[1] + childHeight;
        container.value.style.height = `${containerHeight}px`;
      }
    }

    const options = Object.assign({}, props, {
      position: calculatedPosition,
      size: {
        width: childWidth,
        height: childHeight
      },
      containerHeight: containerHeight
    });

    const calculatedStyle = animationManager.generate(options);

    mixItemInlineStyle(calculatedStyle);

    Object.assign(node.style, calculatedStyle);

    props.onItemDidLayout(node);

    if (i + 1 === children.length) {
      props.onContainerDidLayout();
    }
  }
}

onMounted(() => {
  updateChildren();
})

onUpdated(() => {
  updateChildren();
})

</script>
