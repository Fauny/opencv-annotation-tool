<template lang="pug">
  div#app
    div.main(ref="main"
          @mouseup="muPane" 
          @mousemove="mmPane")
      img(ref="img")
      template(v-if="file")
        div.circle(
            v-for="(p,i) in file.rects" 
            :style="{top:p.y + p.h/2 + 'px', left:p.x + p.w/2 + 'px'}"
            key="i" 
            @click="load(p)")
      div#pane(ref="pane"
        :style="paneClass"
        @dblclick="record"
        @keydown="keydown"
        tabindex="1"
        @mousedown.prevent="mdPane")
    div.side 
      input(ref='if' type="file" id="fileInput" name="file" accept="image/*" @change="openFile")
      div 
        button(@click='$refs.if.click()') AddFile
        button(@click="make") Make & Copy
        //- button(@click="clip") Clipboard
      div.file-list 
        h4 Files
        ul
          li(v-for="f in fileList" :key="f.name" @click="file=f" :class="{active:f==file}") {{f.name}}
          li.hint(v-if="fileList.length==0") no image file
      div.positions(v-if="file")
        h4 Markers
        ul
          li(v-for="(p,i) in file.rects" key="i" @click="load(p)")
            | {{i+1}}: {{p.x}} {{p.y}} {{p.w}} {{p.h}}
            span(@click="del(i)") X
          li.hint(v-if="file.rects.length==0") no rect selected, double click rect selecotr to add
      div     
        h4 Result
        textarea(ref="out" v-model="output")
</template>

<script>
const MARGINS = 6,
    minWidth = 20,
    minHeight = 20
// FULLSCREEN_MARGINS = -10

export default {
    name: 'app',
    data() {
        return {
            fileList: [],
            file: null,
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            cursor: 'default',

            mProps: {
                b: null,
                x: 0,
                y: 0,
                onTopEdge: false,
                onLeftEdge: false,
                onRightEdge: false,
                onBottomEdge: false
            },

            output: ''
        }
    },
    computed: {
        paneClass: function() {
            return {
                width: this.w + 'px',
                height: this.h + 'px',
                top: this.y + 'px',
                left: this.x + 'px',
                cursor: this.cursor
            }
        }
    },
    watch: {
        file() {
            if (this.file) {
                this.$refs.img.src = URL.createObjectURL(this.file.file)
            }
        }
    },
    methods: {
        keydown(e) {
            console.log(e)
            switch (e.key) {
                case 'ArrowLeft':
                    if (e.shiftKey) {
                        this.w--
                        if (e.altKey) this.h = this.w
                    } else {
                        this.x--
                    }
                    break
                case 'ArrowUp':
                    if (e.shiftKey) {
                        this.h--
                        if (e.altKey) this.w = this.h
                    } else {
                        this.y--
                    }
                    break
                case 'ArrowRight':
                    if (e.shiftKey) {
                        this.w++
                        if (e.altKey) this.h = this.w
                    } else {
                        this.x++
                    }
                    break
                case 'ArrowDown':
                    if (e.shiftKey) {
                        this.h++
                        if (e.altKey) this.w = this.h
                    } else {
                        this.y++
                    }
                    break
                case ('ShiftLeft', 'ShiftRight'):
                    this.w = this.h
                    break
                case ('Space', 'Enter'):
                    this.record()
                    break
            }
        },
        getCircle(p) {
            return {
                left: p.x,
                top: p.y,
                width: p.w,
                height: p.h
            }
        },
        record() {
            if (this.file) {
                this.file.rects.push({
                    x: this.x,
                    y: this.y,
                    w: this.w,
                    h: this.h
                })
            }
        },
        load(p) {
            this.x = p.x
            this.y = p.y
            this.w = p.w
            this.h = p.h
        },
        calc(e) {
            this.mProps.b = this.$refs.pane.getBoundingClientRect()
            this.mProps.x = e.clientX - this.mProps.b.left
            this.mProps.y = e.clientY - this.mProps.b.top

            this.mProps.onTopEdge = this.mProps.y < MARGINS
            this.mProps.onLeftEdge = this.mProps.x < MARGINS
            this.mProps.onRightEdge =
                this.mProps.x >= this.mProps.b.width - MARGINS
            this.mProps.onBottomEdge =
                this.mProps.y >= this.mProps.b.height - MARGINS
        },
        canMove() {
            return (
                this.mProps.x > 0 &&
                this.mProps.x < this.mProps.b.width &&
                this.mProps.y > 0 &&
                this.mProps.y < this.mProps.b.height
            )
        },
        mdPane(e) {
            this.calc(e)

            var isResizing =
                this.mProps.onRightEdge ||
                this.mProps.onBottomEdge ||
                this.mProps.onTopEdge ||
                this.mProps.onLeftEdge

            this.clicked = {
                x: this.mProps.x,
                y: this.mProps.y,
                cx: e.clientX,
                cy: e.clientY,
                w: this.mProps.b.width,
                h: this.mProps.b.height,
                isResizing: isResizing,
                isMoving: !isResizing && this.canMove(),
                onTopEdge: this.mProps.onTopEdge,
                onLeftEdge: this.mProps.onLeftEdge,
                onRightEdge: this.mProps.onRightEdge,
                onBottomEdge: this.mProps.onBottomEdge
            }

            e.target.focus()
        },
        muPane(e) {
            this.clicked = null
        },
        mmPane(e) {
            this.calc(e)
            var clicked = this.clicked
            if (this.clicked && this.clicked.isResizing) {
                if (clicked.onRightEdge) {
                    this.w = Math.max(this.mProps.x, minWidth)
                }
                if (clicked.onBottomEdge) {
                    this.h = Math.max(this.mProps.y, minHeight)
                }

                if (clicked.onLeftEdge) {
                    var currentWidth = Math.max(
                        clicked.cx - e.clientX + clicked.w,
                        minWidth
                    )
                    if (currentWidth > minWidth) {
                        this.w = currentWidth
                        this.x = e.clientX
                    }
                }

                if (clicked.onTopEdge) {
                    var currentHeight = Math.max(
                        clicked.cy - e.clientY + clicked.h,
                        minHeight
                    )
                    if (currentHeight > minHeight) {
                        this.h = currentHeight
                        this.y = e.clientY
                    }
                }

                return
            }

            if (clicked && clicked.isMoving) {
                this.y = e.clientY - clicked.y + this.$refs.main.scrollTop
                this.x = e.clientX - clicked.x + this.$refs.main.scrollLeft

                return
            }

            if (
                (this.mProps.onRightEdge && this.mProps.onBottomEdge) ||
                (this.mProps.onLeftEdge && this.mProps.onTopEdge)
            ) {
                this.cursor = 'nwse-resize'
            } else if (
                (this.mProps.onRightEdge && this.mProps.onTopEdge) ||
                (this.mProps.onBottomEdge && this.mProps.onLeftEdge)
            ) {
                this.cursor = 'nesw-resize'
            } else if (this.mProps.onRightEdge || this.mProps.onLeftEdge) {
                this.cursor = 'ew-resize'
            } else if (this.mProps.onBottomEdge || this.mProps.onTopEdge) {
                this.cursor = 'ns-resize'
                // } else if (this.canMove()) {
                //     this.cursor = 'move'
            } else {
                this.cursor = 'default'
            }
        },
        make() {
            var line
            this.output = ''
            for (var f of this.fileList) {
                if (f.rects.length) {
                    line = f.name + ' ' + f.rects.length
                    for (var p of f.rects) {
                        line += ` ${p.x} ${p.y} ${p.w} ${p.h}`
                    }
                    this.output += line + '\n'
                }
            }

            if (this.output) {
                this.$nextTick(this.clip)
            }
        },
        clip() {
            var copyText = this.$refs.out
            copyText.select()
            document.execCommand('Copy')
            alert('Copied the text: ' + copyText.value)
        },
        openFile(e) {
            this.file = {
                name: e.target.files[0].name,
                rects: [],
                file: e.target.files[0]
            }
            this.fileList.push(this.file)
        },
        del(i) {
            this.file.rects.splice(i, 1)
        }
    }
}
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
}
html,
body,
#app {
    width: 100%;
    height: 100%;
}
#app {
    display: flex;
    .main {
        flex: 1;
        height: 100%;
        overflow: auto;
        position: relative;
        img {
            position: absolute;
        }
        #pane {
            position: absolute;
            border: 4px solid rgba(255, 235, 59, 0.61);
        }
        .circle {
            position: absolute;
            background-color: #fff;
            border: 1px solid lime;
            border-radius: 50%;
            width: 10px;
            height: 10px;
        }
    }
    .side {
        height: 100%;
        width: 260px;
        border-left: solid 2px silver;
        > div {
            border-top: solid 2px silver;
        }

        ul {
            li {
                list-style: none;
                cursor: pointer;
                &.active {
                    color: blue;
                }
                span {
                    float: right;
                    margin-right: 0.5em;
                    &:hover {
                        color: red;
                    }
                }
                &.hint{
                    font-style: italic;
                    color:#555;
                }
            }
        }

        button {
            width: 40%;
            padding: 0.5em;
            margin: 0.5em;
        }
        input[type='file'] {
            display: none;
        }
        textarea {
            width: 100%;
            min-height:4em;
        }
        h4{
            font-size:1rem;
            background-color: silver;
            padding-left:2px; 
        }
    }
}
</style>
