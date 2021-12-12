
import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card } from 'antd';

const SmenuSub2 = () => {
    return (
        <div>
            <BreadcrumbCustom first="异步菜单" />
            <Row gutter={16}>
                <Col md={24}>
                    <Card title="异步子菜单" bordered={false}>
                        <div>异步子菜单2</div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SmenuSub2;
