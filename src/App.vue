<template>
    <!-- 标题栏 -->
    <div id="header">
        <div class="header-logo">
            <el-icon :size="20">
                <logo />
            </el-icon>
        </div>
        <div class="header-menu">
            <rain-menu>
                <el-dropdown trigger="click" @command="onFile">
                    <rain-menu-item>文件</rain-menu-item>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>新建链接</el-dropdown-item>
                            <el-dropdown-item>新建文件</el-dropdown-item>
                            <el-dropdown-item command="exit">退出</el-dropdown-item>

                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <rain-menu-item>编辑</rain-menu-item>
                <rain-menu-item>选择</rain-menu-item>
                <rain-menu-item>查看</rain-menu-item>
                <rain-menu-item>转到</rain-menu-item>
                <rain-menu-item>运行</rain-menu-item>
                <el-dropdown trigger="click" @command="onHelp">
                    <rain-menu-item>帮助</rain-menu-item>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>文档</el-dropdown-item>
                            <el-dropdown-item command="openDevTool">打开开发人员工具</el-dropdown-item>
                            <el-dropdown-item>检查更新</el-dropdown-item>
                            <el-dropdown-item command="about">关于</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </rain-menu>
        </div>
        <div class="header-title">{{ title }}</div>
        <div class="header-option">
            <div class="header-option-btn" @click="toMin">
                <el-icon :size="20">
                    <minus />
                </el-icon>
            </div>
            <div class="header-option-btn" @click="toMax">
                <el-icon :size="20">
                    <full-screen />
                </el-icon>
            </div>
            <div class="header-option-btn" @click="doClose">
                <el-icon :size="20">
                    <close />
                </el-icon>
            </div>
        </div>
    </div>
    <!-- 侧边栏 -->
    <div id="side">
        <div class="side-btn" :class="menu === 1 ? 'active' : ''" @click="menu = 1">
            <el-icon :size="30">
                <database />
            </el-icon>
        </div>
        <div class="side-btn" :class="menu === 2 ? 'active' : ''" @click="menu = 2">
            <el-icon :size="30">
                <file-sql />
            </el-icon>
        </div>
        <div class="side-btn" :class="menu === 3 ? 'active' : ''" @click="menu = 3">
            <el-icon :size="30">
                <record />
            </el-icon>
        </div>
    </div>
    <!-- 侧边面板 -->
    <div id="side-panel"></div>
    <!-- 容器 -->
    <div id="container">
        <!-- 主视图 -->
        <div id="main"></div>
        <!-- 页低面板 -->
        <div id="footer"></div>
    </div>
    <!-- 状态栏 -->
    <div id="status"></div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import { Close, Minus, FullScreen } from '@element-plus/icons-vue';

// api
import { toMin, toMax, doClose, openDevTools } from '@/api/ApplicationApi';
import { showMessageBox } from '@/api/DialogApi';

// 图标 
import Logo from '@/icon/Logo.vue';
import Database from '@/icon/Database.vue';
import FileSql from '@/icon/FileSql.vue';
import Record from '@/icon/Record.vue'

// 组件
import RainMenu from '@/components/RainMenu/index.vue';
import RainMenuItem from '@/components/RainMenu/Item.vue';


export default defineComponent({
    components: {
        Close, Minus, FullScreen, Database, FileSql, Record, Logo,
        RainMenu, RainMenuItem
    },
    data: () => {
        return {
            title: '雨 - 编辑器',
            menu: 1
        }
    },
    methods: {
        toMin,
        toMax,
        doClose,
        onFile(command: string) {
            switch(command) {
                case 'exit':
                    doClose();
                    break;
                default:
                    console.error('文件命令未知')
            }
        },
        onHelp(command: string) {
            switch (command) {
                case 'openDevTool':
                    openDevTools();
                    break;
                case 'about':
                    showMessageBox({
                        title: '雨 - 数据工作台',
                        message: '雨 - 数据工作台',
                        detail: '版本：0.0.1\nElectron：20.0.3\nChromium：104.0.5112.81\nNode.js：16.15.1',
                        type: 'info',
                        buttons: ['确定']
                    })
                    break;
                default:
                    console.error('帮助命令未知')
            }
        }
    }
})
</script>

<style lang="less">

</style>